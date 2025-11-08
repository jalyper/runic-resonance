# RUNIC RESONANCE

**Discover your League of Legends spirit champion through AI-powered personality analysis**

Built for the Rift Rewind Hackathon 2025 using Riot Games API + AWS Bedrock AI

---

## 🎯 What Is This?

Runic Resonance analyzes your League of Legends match history to reveal which champion's spirit resonates within you. By examining your playstyle across 10 personality traits, we discover your true essence in the world of Runeterra - then use AI to generate a mystical reading and beautiful artwork.

**Key Features:**
- Analyzes 50 recent ranked games via Riot Games API
- Calculates 10 lore-based personality traits from behavioral data
- 3-slot champion matching system with "trait farming" mechanics
- AI-generated mystical narratives (AWS Bedrock Claude 3.5 Sonnet)
- AI-generated trait artwork (AWS Bedrock Titan Image Generator v2)
- Beautiful, responsive UI with Arcane-inspired aesthetics

---

## 🚀 Quick Start for Judges

### Prerequisites

- **Docker Desktop** (recommended) OR:
  - Python 3.11+
  - Node.js 18+
  - MongoDB
  - Yarn package manager

### Option 1: Using Existing Deployment (If Available)

If you have access to the deployed version, simply:
1. Navigate to the deployment URL
2. Enter a Riot ID in the format: `GameName#TAG` (e.g., `Jalyper#piano`)
3. Select your region
4. Click "Reveal My Spirit Champion"

### Option 2: Run Locally (Full Experience)

**⚠️ IMPORTANT: You'll need AWS credentials for full functionality**

The app requires:
- **Riot Games API Key** (24-hour development key available at [developer.riotgames.com](https://developer.riotgames.com))
- **AWS Account** with Bedrock access (for AI features)

#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd runic-resonance
```

#### Step 2: Set Up Environment Variables

Create `/app/backend/.env`:

```env
# MongoDB (local)
MONGO_URL="mongodb://localhost:27017"
DB_NAME="runic_resonance"
CORS_ORIGINS="*"

# Riot Games API
RIOT_API_KEY="RGAPI-your-24-hour-dev-key-here"

# AWS Bedrock (for AI features)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
BEDROCK_MODEL_ID="anthropic.claude-3-5-sonnet-20241022-v2:0"
```

Create `/app/frontend/.env`:

```env
REACT_APP_BACKEND_URL="http://localhost:8001"
```

#### Step 3: Install Dependencies

**Backend:**
```bash
cd /app/backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd /app/frontend
yarn install
```

#### Step 4: Start MongoDB

```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# OR use your local MongoDB installation
mongod --dbpath /your/data/path
```

#### Step 5: Start the Services

**Terminal 1 - Backend:**
```bash
cd /app/backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd /app/frontend
yarn start
```

The app will be available at: **http://localhost:3000**

---

## 📖 How to Use

1. **Enter Your Riot ID**
   - Format: `GameName#TAG` (e.g., `Doublelift#NA1`, `Faker#KR1`)
   - Select your region from the dropdown

2. **Wait for Analysis**
   - The app fetches your last 50 ranked games
   - Calculates 10 personality traits
   - Matches you with champions
   - Generates AI narrative (20-40 seconds)

3. **View Your Results**
   - See your spirit champion with resonance %
   - Check which traits you unlocked (the "slots")
   - Read your personalized AI-generated mystical reading
   - See runner-up champions

4. **Understand the Slots**
   - Each champion has 3 trait slots
   - Score 7+ on a trait to unlock it
   - 3/3 slots = "Perfect Resonance" achievement
   - Playing a champion increases its resonance

---

## 🎨 Tech Stack

**Backend:**
- FastAPI (Python web framework)
- MongoDB (data storage)
- Boto3 (AWS SDK)
- Riot Games API (match data)

**Frontend:**
- React 18
- Tailwind CSS
- Axios (API calls)
- Lucide React (icons)

**AI & ML:**
- AWS Bedrock (managed AI service)
- Claude 3.5 Sonnet v2 (text generation)
- Amazon Titan Image Generator v2 (artwork)

**Infrastructure:**
- Docker containers
- Supervisor (process management)
- Nginx (reverse proxy)

---

## 🔑 API Keys & Credentials

### Riot Games API Key

1. Go to [developer.riotgames.com](https://developer.riotgames.com)
2. Sign in with your Riot account
3. Generate a **Development API Key** (valid for 24 hours)
4. Add to `backend/.env` as `RIOT_API_KEY`

### AWS Bedrock Setup

1. Create AWS account at [aws.amazon.com](https://aws.amazon.com)
2. Go to IAM → Create User → `bedrock-developer`
3. Attach policy: `AmazonBedrockFullAccess`
4. Create access keys
5. Add to `backend/.env`:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION="us-east-1"`

**Note:** Bedrock models are automatically enabled in new AWS accounts (no manual model access request needed as of 2025).

---

## 📊 Project Structure

```
/app/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── riot_api.py            # Riot Games API integration
│   ├── personality_engine.py  # Trait calculation logic
│   ├── bedrock_ai.py          # AWS Bedrock text generation
│   ├── image_generator.py     # AWS Bedrock image generation
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (create this)
│   └── static/traits/         # AI-generated trait images (10 PNGs)
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── components/
│   │   │   ├── LandingPage.js
│   │   │   ├── AnalysisPage.js
│   │   │   ├── ResultsPage.js
│   │   │   └── AboutPage.js
│   │   ├── index.css          # Global styles + fonts
│   │   └── index.js           # React entry point
│   ├── package.json           # Node dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── .env                   # Frontend environment (create this)
│
├── README.md                  # This file
├── PROJECT_NOTES.md           # Hackathon submission narrative
└── supervisord.conf           # Process management (if using supervisor)
```

---

## 🧪 Testing the App

### Test Accounts to Try

You can test with any League of Legends player's Riot ID:

**Examples:**
- `Jalyper#piano` (NA) - Fighter main, balanced traits
- `Doublelift#NA1` (NA) - ADC main
- `Faker#KR1` (Korea) - Mid lane legend
- Any valid Riot ID with recent ranked games

**Requirements for analysis:**
- Account must have at least 30 ranked games in recent history
- Must use the new Riot ID format: `GameName#TAG`
- Old summoner names won't work (deprecated API)

### Expected Behavior

**Successful Analysis:**
- Loading takes 15-30 seconds
- Shows animated "Runes are Speaking" screen
- Displays spirit champion with resonance %
- Shows 3 slots (some locked, some unlocked)
- Generates unique AI narrative
- Shows top 3 champion matches

**Common Issues:**
- "Account not found" → Check Riot ID format
- "Unable to fetch data" → Verify Riot API key is valid
- "An unexpected error" → Check backend logs for details
- Missing images → Trait images need to be pre-generated (see below)

---

## 🎨 Pre-Generating Trait Images (Optional)

The app includes 10 pre-generated AI trait images in `/app/backend/static/traits/`. If you want to regenerate them:

```bash
cd /app/backend
python3 generate_trait_images.py
```

This will create new artwork using AWS Bedrock Titan Image Generator (~2 minutes, requires AWS credentials).

---

## 🐛 Troubleshooting

### Backend Won't Start

**Check logs:**
```bash
# If using supervisor
tail -f /var/log/supervisor/backend.err.log

# If running manually
# Terminal output will show errors
```

**Common fixes:**
- Ensure MongoDB is running
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check `.env` file exists with valid credentials

### Frontend Won't Start

**Common fixes:**
- Use `yarn` not `npm` (npm can cause issues)
- Clear cache: `yarn cache clean`
- Delete `node_modules` and reinstall: `rm -rf node_modules && yarn install`
- Verify `.env` has correct `REACT_APP_BACKEND_URL`

### API Errors

**"Forbidden" or 403 errors:**
- Riot API key expired (24-hour limit for dev keys)
- Get new key at [developer.riotgames.com](https://developer.riotgames.com)

**"ValidationException" from AWS:**
- Content filter blocked the request
- This is expected for some prompts (failsafes are in place)

### MongoDB Connection Issues

**Can't connect to MongoDB:**
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Try default: `mongodb://localhost:27017`

---

## 📈 Performance Notes

**Analysis Speed:**
- Riot API calls: ~8-12 seconds (fetching 50 games)
- Trait calculation: <1 second
- AI narrative generation: 8-12 seconds (AWS Bedrock)
- Total: ~20-40 seconds per analysis

**Rate Limits:**
- Riot API: 100 requests per 2 minutes
- AWS Bedrock: No hard limit (pay per request)
- MongoDB: No limit for local usage

**Costs:**
- Riot API: **Free** (development key)
- AWS Bedrock Claude: ~$0.003 per analysis
- AWS Bedrock Titan Images: ~$0.004 per image (one-time generation)
- MongoDB: **Free** (local)

---

## 🏆 Hackathon Submission Details

**Built for:** Rift Rewind Hackathon 2025  
**Category:** AI-Powered League of Legends Application  
**Development Time:** 3 days  
**Team Size:** Solo project

**Key Innovations:**
- "Trait farming" mechanic encouraging positive gameplay
- Lore-based personality system (not just mechanics)
- 3-slot champion resonance with play-rate bonuses
- AI-generated Arcane-style artwork for each trait
- Balanced formulas tested with real player profiles

---

## 📝 License & Attribution

**APIs & Services Used:**
- Riot Games API ([developer.riotgames.com](https://developer.riotgames.com))
- AWS Bedrock ([aws.amazon.com/bedrock](https://aws.amazon.com/bedrock))
- Data Dragon (champion images)

**Fonts:**
- Orbitron by Matt McInerney (Google Fonts)
- Rajdhani by Indian Type Foundry (Google Fonts)
- Inter by Rasmus Andersson (Google Fonts)

**Art Style Inspiration:**
- Arcane (Netflix series) - for trait image prompts
- League of Legends lore and universe

---

## 💬 Support & Questions

For hackathon judges:
- Check `PROJECT_NOTES.md` for full development narrative
- View `About` page in the app for user-facing explanation
- All code is documented with comments
- Backend logs provide detailed error information

**Technical Questions?**
- Backend: Check FastAPI docs at `/docs` endpoint
- Frontend: React DevTools show component state
- Database: MongoDB Compass for visual inspection

---

**May the Runes guide your path, Summoner.**

---

*Built with passion for League of Legends and AI innovation.*  
*Rift Rewind Hackathon 2025*
