# 🎮 Runic Resonance - Railway Deployment

> League of Legends personality analyzer using Riot API + AWS Bedrock AI

## 🚀 One-Click Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

---

## 📋 Quick Setup (5 Steps)

### 1️⃣ Fork/Clone Repository

```bash
git clone <your-repo-url>
cd runic-resonance
```

### 2️⃣ Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository

### 3️⃣ Add MongoDB

1. In Railway project → Click "+ New"
2. Select "Database" → "Add MongoDB"
3. Copy the `MONGO_URL` from MongoDB service variables

### 4️⃣ Set Environment Variables

In your service → "Variables" tab, add:

```env
MONGO_URL=<from-mongodb-service>
DB_NAME=runic_resonance
CORS_ORIGINS=*
RIOT_API_KEY=<get-from-developer.riotgames.com>
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
REACT_APP_BACKEND_URL=<your-railway-url-after-deployment>
```

### 5️⃣ Deploy & Update

1. Railway auto-deploys → Wait for completion
2. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)
3. Update `REACT_APP_BACKEND_URL` with your Railway URL
4. Click "Redeploy"

---

## 🔑 Getting Required Keys

### Riot API Key (Required)
1. Go to [developer.riotgames.com](https://developer.riotgames.com)
2. Sign in with Riot account
3. Copy development key
4. ⚠️ Dev keys expire in 24 hours

### AWS Bedrock Access (Required)
1. AWS Console → IAM → Create user
2. Attach policy: `AmazonBedrockFullAccess`
3. Create access key
4. Copy Access Key ID and Secret
5. Ensure region is `us-east-1`

---

## ✅ Testing Your Deployment

Visit your Railway URL and:

1. Enter Riot ID: `Jalyper#piano`
2. Select region: `North America`
3. Click "Discover My Spirit"
4. Wait ~30 seconds for analysis
5. View results with champion + AI narrative

---

## 📦 What's Inside

**Backend** (FastAPI + Python)
- Riot Games API integration
- AWS Bedrock (Claude 3.5 + Titan Image)
- 10-trait personality engine
- MongoDB for data storage

**Frontend** (React + Tailwind)
- Beautiful animated UI
- Real-time analysis progress
- AI-generated trait artwork
- Responsive design

---

## 🎯 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Radix UI
- **Backend**: FastAPI, Python 3.11
- **Database**: MongoDB
- **AI**: AWS Bedrock (Claude 3.5 Sonnet, Titan Image)
- **API**: Riot Games API
- **Deployment**: Railway

---

## 💰 Cost Estimate

- **Railway**: $5 free credit/month
- **AWS Bedrock**: ~$0.01 per analysis
- **Riot API**: FREE

**Total for hackathon**: Should stay within free tiers

---

## 🔧 Troubleshooting

### Build Failed
- Check all files exist: `supervisord.conf`, `nixpacks.toml`, `railway.json`
- View logs in Railway dashboard

### Frontend Blank
- Verify `REACT_APP_BACKEND_URL` is set correctly
- Check browser console for errors

### API Errors
- Ensure all environment variables are set
- Verify Riot API key hasn't expired
- Check AWS credentials have Bedrock access

---

## 📚 Full Documentation

- **Complete Setup**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Railway Guide**: See [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)
- **Methodology**: See [METHODOLOGY.md](./METHODOLOGY.md)
- **Project Notes**: See [PROJECT_NOTES.md](./PROJECT_NOTES.md)

---

## 🏆 Hackathon Submission

Built for **Rift Rewind Hackathon** by Riot Games

**Features**:
- ✅ Analyzes 50 ranked games
- ✅ Calculates 10 personality traits
- ✅ Matches with 173 champions (lore-based)
- ✅ Generates AI narratives (AWS Bedrock)
- ✅ Beautiful UI with AI-generated artwork

---

## 🛠️ Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload

# Frontend
cd frontend
yarn install
yarn start
```

---

## 📄 License

MIT License - Built for Riot Games Hackathon

---

**Questions?** Check the troubleshooting sections in our docs!

**Good luck! 🚀🎮**
