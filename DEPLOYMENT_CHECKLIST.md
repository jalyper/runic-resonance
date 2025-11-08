# 🚀 Railway Deployment Checklist

## Pre-Deployment ✅

- [x] supervisord.conf exists in /app
- [x] nixpacks.toml properly configured
- [x] railway.json with correct settings
- [x] Dockerfile created (alternative)
- [x] Procfile configured
- [x] .dockerignore created
- [x] Frontend build configured with serve
- [x] Backend CORS properly configured
- [x] All dependencies in requirements.txt
- [x] All dependencies in package.json

## Files Created for Railway

1. **supervisord.conf** - Manages backend + frontend processes
2. **nixpacks.toml** - Build configuration for Railway
3. **railway.json** - Railway deployment settings
4. **Dockerfile** - Alternative Docker deployment
5. **.dockerignore** - Docker build optimization
6. **RAILWAY_DEPLOY.md** - Step-by-step deployment guide
7. **.env.example** - Environment variable template

## What Railway Will Do

1. **Detect Project Type**: Nixpacks will see nixpacks.toml
2. **Install Phase**:
   - Install Python 3.11, Node.js 18, Yarn
   - Install supervisor and uvicorn
   - Install backend dependencies from requirements.txt
   - Install frontend dependencies with yarn
3. **Build Phase**:
   - Build React frontend (creates /app/frontend/build)
4. **Start Phase**:
   - Start supervisord
   - Supervisor starts:
     - Backend on port 8001 (uvicorn)
     - Frontend on port 3000 (serve)

## Required Environment Variables

Copy these to Railway Variables tab:

```
MONGO_URL=<from_railway_mongodb_service>
DB_NAME=runic_resonance
CORS_ORIGINS=*
RIOT_API_KEY=<from_developer.riotgames.com>
AWS_ACCESS_KEY_ID=<your_aws_key>
AWS_SECRET_ACCESS_KEY=<your_aws_secret>
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
REACT_APP_BACKEND_URL=https://<your-railway-url>
```

## Port Configuration

- **Backend**: 8001 (internal)
- **Frontend**: 3000 (internal)
- **Railway**: Will expose port 3000 publicly (or auto-detect)

## Post-Deployment Steps

1. **Get Railway URL** from dashboard
2. **Update `REACT_APP_BACKEND_URL`** with Railway URL
3. **Redeploy** to apply changes
4. **Test** with a Riot ID

## Testing Commands

Once deployed, test with:

```bash
# Health check
curl https://your-app.up.railway.app/api/health

# Analyze (replace URL and Riot ID)
curl -X POST https://your-app.up.railway.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"riot_id": "Jalyper#piano", "region": "na", "match_count": 50}'
```

## Common Issues & Fixes

### 1. Build Fails: "No buildpack detected"
**Fix**: Ensure nixpacks.toml is in root directory

### 2. Build Fails: "Module not found"
**Fix**: Check requirements.txt and package.json are complete

### 3. Frontend shows blank page
**Fix**: 
- Check browser console for errors
- Verify REACT_APP_BACKEND_URL is set
- Ensure build completed successfully

### 4. API calls fail (CORS error)
**Fix**:
- Set CORS_ORIGINS=* or include Railway URL
- Verify backend is running on port 8001

### 5. MongoDB connection error
**Fix**:
- Verify MongoDB service is running in Railway
- Check MONGO_URL variable is correct
- Ensure both services are in same project

### 6. Supervisor won't start
**Fix**:
- Check logs for Python/Node errors
- Verify supervisord.conf path is correct
- Ensure uvicorn and serve are installed

## Deployment Methods

### Method 1: Nixpacks (Recommended)
Railway auto-detects nixpacks.toml and builds accordingly.

### Method 2: Docker
If Nixpacks fails, Railway will try Dockerfile.

### Method 3: Procfile
Fallback if neither Nixpacks nor Docker work.

## Cost Breakdown

**Railway Free Tier:**
- $5 credit per month
- Enough for development/testing

**Estimated Monthly Costs:**
- Railway: ~$0-5 (depends on usage)
- AWS Bedrock: ~$0.01 per analysis
- MongoDB: Included in Railway

**For Hackathon:**
- Should stay within free tier if moderate usage
- Monitor Railway dashboard for usage

## Security Notes

⚠️ **Do NOT commit:**
- .env files
- AWS credentials
- API keys

✅ **Do commit:**
- .env.example (template only)
- All deployment configs
- Documentation

## Final Checklist Before Deployment

- [ ] All code committed to Git
- [ ] Pushed to GitHub
- [ ] MongoDB service added in Railway
- [ ] All environment variables configured
- [ ] AWS Bedrock access confirmed
- [ ] Riot API key obtained
- [ ] Ready to deploy!

---

## Quick Start Command

```bash
# From /app directory
git add .
git commit -m "Railway deployment ready"
git push origin main
```

Then follow RAILWAY_DEPLOY.md for Railway setup.

---

**Deployment Time Estimate:** 5-10 minutes

**Good luck! 🎮🚀**
