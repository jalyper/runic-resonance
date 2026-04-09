# Runic Resonance

**A full-stack web app that analyzes a League of Legends player's match history and uses AWS Bedrock AI to reveal their "spirit champion" and generate a personalized mystical narrative.**

Pull a Riot ID, fetch the last 50 ranked games via the Riot Games API, calculate 10 behavioral personality traits from the match data, match the player to champions through a 3-slot resonance system, then generate a personalized narrative with Claude 3.5 Sonnet and trait artwork with Amazon Titan Image Generator v2.

Originally built for the 2025 Rift Rewind Hackathon. MIT-licensed.

## Architecture at a glance

```
 ┌──────────────────────┐       ┌──────────────────────────┐
 │  React 19 frontend   │  ──>  │  FastAPI backend          │
 │  (CRA + craco, only  │       │  (uvicorn, port 8001)     │
 │   axios + lucide)    │       │                           │
 └──────────────────────┘       │  ┌─────────────────────┐  │
                                │  │ riot_api.py         │──┼──> Riot Games API
                                │  │ personality_engine  │  │    (match history)
                                │  │ bedrock_ai.py       │──┼──> AWS Bedrock
                                │  │ image_generator.py  │──┼──> Claude 3.5 Sonnet
                                │  └─────────────────────┘  │    Titan Image v2
                                │                           │
                                │  MongoDB (Motor async)    │
                                └──────────────────────────┘
```

The personality engine computes 10 lore-based traits (aggression, patience, strategy, etc.) from raw match telemetry, matches them to a curated pool of champions through a 3-slot "trait farming" mechanic, and passes the top match into Bedrock for a per-player narrative. Trait artwork is generated once and cached as static PNGs in `backend/static/traits/`.

## Tech stack

| Layer | Tool |
|-------|------|
| Frontend | React 19, CRA + craco, Tailwind CSS, axios, lucide-react |
| Backend | FastAPI, uvicorn, Motor (async MongoDB), Pydantic |
| Data store | MongoDB |
| External APIs | Riot Games API (match history, account lookup) |
| AI | AWS Bedrock — Claude 3.5 Sonnet v2 (narratives), Titan Image Generator v2 (trait art) |

## Running locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- Yarn (`npm install -g yarn`)
- MongoDB (local install or Docker)
- A Riot Games dev API key — get one at [developer.riotgames.com](https://developer.riotgames.com) (expires every 24 hours)
- An AWS account with Bedrock access (Claude 3.5 Sonnet v2 + Titan Image Generator v2 enabled in `us-east-1`)

### Setup

```bash
git clone https://github.com/jalyper/runic-resonance.git
cd runic-resonance
```

**Backend:**

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="runic_resonance"
CORS_ORIGINS="*"

RIOT_API_KEY="RGAPI-your-24-hour-dev-key"

AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
BEDROCK_MODEL_ID="anthropic.claude-3-5-sonnet-20241022-v2:0"
```

**Frontend:**

```bash
cd ../frontend
yarn install
```

Create `frontend/.env`:

```env
REACT_APP_BACKEND_URL="http://localhost:8001"
```

**Start MongoDB** (if not already running):

```bash
docker run -d -p 27017:27017 --name runic-mongo mongo:latest
```

### Run

Two terminals during development:

```bash
# Terminal 1 — backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 — frontend
cd frontend
yarn start
```

Or a single-command production-ish path using the bundled process manager:

```bash
cd frontend && yarn build && cd ..
python start.py
```

`start.py` launches `uvicorn` on 8001 and serves the built bundle via `npx serve` on 3000. It expects `frontend/build/` to exist — run `yarn build` first.

Open [http://localhost:3000](http://localhost:3000) once both are running.

## How to use

1. **Enter a Riot ID** — format is `GameName#TAG` (e.g., `Doublelift#NA1`, `Faker#KR1`). Select the appropriate region from the dropdown.
2. **Wait for analysis** — the backend fetches the last 50 ranked games, calculates traits, matches champions, and generates an AI narrative. Total time is typically 20-40 seconds.
3. **Read your result** — spirit champion with resonance percentage, unlocked trait slots, generated narrative, and runner-up matches.

The account needs to have at least 30 ranked games and must use the modern Riot ID format (the old summoner-name API is deprecated).

## AWS Bedrock setup

1. Create an IAM user with the `AmazonBedrockFullAccess` policy.
2. Create access keys and add them to `backend/.env`.
3. In the AWS console, enable model access for Claude 3.5 Sonnet v2 and Titan Image Generator v2 in the `us-east-1` region. Most accounts have this enabled by default as of 2025.

**Cost estimate:** roughly $0.003 per analysis (Claude 3.5 Sonnet) plus a one-time ~$0.04 to generate the 10 trait images via Titan.

## Pre-generating trait images

Trait artwork is generated once and cached as static PNGs in `backend/static/traits/`. The repo ships with the pre-generated set. If you want to regenerate them (changes the art style or prompts), run:

```bash
cd backend
python generate_trait_images.py
```

This takes ~2 minutes and requires valid AWS Bedrock credentials.

## Project structure

```
runic-resonance/
├── backend/
│   ├── server.py              FastAPI app + endpoints
│   ├── riot_api.py            Riot Games API integration
│   ├── personality_engine.py  10-trait calculation logic
│   ├── bedrock_ai.py          Bedrock Claude narrative generation
│   ├── image_generator.py     Bedrock Titan image generation
│   ├── generate_trait_images.py  One-time script to produce trait art
│   ├── static/traits/         Pre-generated trait PNGs (10 files)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js             Page routing
│   │   ├── components/
│   │   │   ├── LandingPage.js
│   │   │   ├── AnalysisPage.js
│   │   │   ├── ResultsPage.js
│   │   │   └── AboutPage.js
│   │   ├── index.js
│   │   └── index.css
│   ├── craco.config.js        @/ path alias + hot-reload toggles
│   ├── tailwind.config.js
│   └── package.json
├── start.py                   Simple two-process launcher
├── README.md                  (this file)
├── METHODOLOGY.md             Deep dive on trait calculation
└── PROJECT_NOTES.md           Original hackathon notes
```

## Troubleshooting

- **"Account not found"** — check the Riot ID format (`GameName#TAG`, not old summoner name).
- **"Unable to fetch data" / 403** — Riot dev API keys expire after 24 hours. Regenerate at [developer.riotgames.com](https://developer.riotgames.com).
- **Bedrock ValidationException** — content filter blocked the prompt. The code has a fallback narrative path; this is expected occasionally.
- **MongoDB connection errors** — make sure the Mongo container or local instance is running and the URL in `.env` points at it.

## Attribution

- Riot Games API via [developer.riotgames.com](https://developer.riotgames.com)
- AWS Bedrock (Claude 3.5 Sonnet v2 + Titan Image Generator v2)
- Champion images via Data Dragon
- Fonts: Orbitron, Rajdhani, and Inter via Google Fonts
- Art style inspiration: *Arcane* (Netflix)

Not affiliated with or endorsed by Riot Games or Netflix.

## License

MIT. See the repository for the license text.
