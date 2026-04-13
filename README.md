# Runic Resonance

Discover your League of Legends spirit champion through AI-powered personality analysis. Fetches match history from the Riot API, scores ten lore-based personality traits, finds the champion that resonates strongest, and generates a narrative via AWS Bedrock (Claude 3.5 Sonnet).

## Stack

- **Backend**: FastAPI + Motor (async MongoDB) + boto3 (Bedrock) + Riot API
- **Frontend**: React 19 + CRA (craco) + Tailwind CSS + lucide-react
- **Database**: MongoDB (Atlas M0 is enough)
- **AI**: AWS Bedrock, `anthropic.claude-3-5-sonnet-20241022-v2:0`

## Local development

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env  # then fill in real values
uvicorn server:app --reload --port 8000
```

### Frontend
```bash
cd frontend
yarn install
cp .env.example .env  # set REACT_APP_BACKEND_URL=http://localhost:8000
yarn start
```

## Environment variables

See `backend/.env.example` and `frontend/.env.example`.

Backend needs:
- `MONGO_URL`, `DB_NAME` — MongoDB connection
- `RIOT_API_KEY` — Riot developer key (24h dev / production via developer.riotgames.com)
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `BEDROCK_MODEL_ID` — Bedrock access
- `CORS_ORIGINS` — comma-separated allowed origins

## Deployment

Backend ships as a Docker image to Fly.io (see `backend/Dockerfile` and `backend/fly.toml`). Frontend builds to static assets for Cloudflare Pages (root `frontend`, build `yarn build`, output `build`).

```bash
# Backend
cd backend
fly launch --no-deploy --copy-config --name runic-resonance
fly secrets set MONGO_URL=... DB_NAME=... RIOT_API_KEY=... AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... AWS_REGION=us-east-1 BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0 CORS_ORIGINS=https://runic-resonance.pages.dev
fly deploy
```

## API

- `GET /api/` — health
- `GET /api/health` — detailed service health
- `POST /api/analyze` — body: `{ riot_id: "Name#TAG", region: "na", match_count: 20 }`
- `GET /api/analysis/{id}` — retrieve a stored analysis
- `GET /api/champions` — trait→champion reference data
