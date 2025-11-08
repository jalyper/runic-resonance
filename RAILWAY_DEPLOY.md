# 🚀 Railway Deployment - Quick Guide

## Step 1: Prepare Repository

```bash
# Ensure all files are committed
git add .
git commit -m "Ready for Railway deployment"
git push
```

## Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. **Important**: Railway should auto-detect **Nixpacks** as the builder
   - If it tries to use Docker, go to Settings → Builder → Select "Nixpacks"

## Step 3: Add MongoDB Database

1. In your Railway project dashboard
2. Click **"+ New"** → **"Database"** → **"Add MongoDB"**
3. Railway will automatically provision MongoDB
4. Copy the **MONGO_URL** from the MongoDB service variables

## Step 4: Configure Environment Variables

Click on your main service → **"Variables"** tab → Add these variables:

### Required Variables:

```env
# MongoDB (copy from your MongoDB service)
MONGO_URL=mongodb://mongo:XXXXX@containers-us-west-XXX.railway.app:XXXX

# Database
DB_NAME=runic_resonance

# CORS (for testing, use *; for production, use your Railway URL)
CORS_ORIGINS=*

# Riot API (get from https://developer.riotgames.com)
RIOT_API_KEY=RGAPI-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

# AWS Credentials (for Bedrock AI)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# AWS Bedrock Model
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Frontend URL (add this AFTER first deployment)
REACT_APP_BACKEND_URL=https://your-app.up.railway.app
```

## Step 5: Deploy

1. Railway will automatically start deploying
2. Wait for build to complete (~5-10 minutes)
3. Railway will provide you with a public URL

## Step 6: Update Frontend URL

After first deployment:

1. Note your Railway URL (e.g., `https://runic-resonance.up.railway.app`)
2. Go back to **Variables** tab
3. Update `REACT_APP_BACKEND_URL` with your Railway URL
4. Click **"Redeploy"**

## Step 7: Test Your Deployment

Visit your Railway URL and test:

1. ✅ Landing page loads
2. ✅ Enter Riot ID: `Jalyper#piano`
3. ✅ Analysis runs (~30 seconds)
4. ✅ Results page shows with champion + narrative

---

## 🔧 Troubleshooting

### Build Fails: "Nixpacks was unable to generate a build plan"

**Problem:** Railway can't detect the build configuration

**Solutions:**
1. Verify `nixpacks.toml` exists in root directory
2. Check Railway Settings → Builder is set to "Nixpacks"
3. If Docker is being used, manually switch to Nixpacks

### Build Fails: Docker "yarn.lock not found"

**Problem:** Railway is trying to use Docker instead of Nixpacks

**Solution:**
1. Go to Railway Settings → Deploy
2. Find "Builder" section
3. Change from "Docker" to "Nixpacks"
4. Redeploy

### Build Fails: General

**Solution:** Ensure these files exist in root:
- `nixpacks.toml`
- `supervisord.conf`
- `Procfile`
- `railway.json`

### Frontend Can't Reach Backend

**Problem:** API calls fail with CORS or network errors

**Solutions:**
1. Verify `REACT_APP_BACKEND_URL` matches your Railway URL
2. Check `CORS_ORIGINS` includes your Railway URL or is set to `*`
3. Ensure backend is running on port 8001

### MongoDB Connection Failed

**Problem:** Backend can't connect to MongoDB

**Solutions:**
1. Verify MongoDB service is running in Railway
2. Copy correct `MONGO_URL` from MongoDB service
3. Ensure both services are in the same project

### AWS Bedrock Errors

**Problem:** AI narrative generation fails

**Solutions:**
1. Verify AWS credentials are correct
2. Check IAM user has `AmazonBedrockFullAccess` policy
3. Confirm region is `us-east-1` (Claude 3.5 available here)

### Riot API 403 Errors

**Problem:** Game data fetching fails

**Solutions:**
1. Dev API keys expire in 24 hours - get a new one
2. Verify key is valid at [developer.riotgames.com](https://developer.riotgames.com)
3. Update `RIOT_API_KEY` variable and redeploy

---

## 📊 Monitoring

**View Logs:**
- Railway dashboard → Your service → **"Deployments"** → Click latest deployment → **"View Logs"**

**Check Status:**
- Green indicator = healthy
- Red = service crashed (check logs)

---

## 💰 Cost Estimate

**Railway:**
- Free tier: $5 credit/month
- Typical usage: ~$2-5/month for hobby projects

**AWS Bedrock:**
- Claude 3.5 Sonnet: ~$0.003 per analysis
- Titan Image: ~$0.008 per image (already generated, won't re-generate)
- Total per analysis: ~$0.01

**Riot API:**
- FREE (no costs)

---

## 🎯 Production Tips

1. **Get Production Riot API Key:**
   - Dev keys expire in 24 hours
   - Apply for production key at Riot Developer Portal
   - Takes 1-2 weeks for approval

2. **Monitor AWS Costs:**
   - AWS Console → Billing Dashboard
   - Set up billing alerts

3. **Optimize Costs:**
   - Pause Railway service when not in use
   - AWS Bedrock is pay-per-use only

4. **Security:**
   - Never commit `.env` files
   - Use Railway's environment variables
   - Rotate AWS keys after hackathon

---

## 🏆 Hackathon Submission

After successful deployment:

1. ✅ Test thoroughly with multiple Riot IDs
2. ✅ Take screenshots of working app
3. ✅ Note your Railway URL
4. ✅ Submit to Devpost with:
   - Live demo URL
   - GitHub repo link
   - Screenshots/video
   - README with setup instructions

---

## Alternative: Render.com

If Railway doesn't work:

1. Go to [render.com](https://render.com)
2. **New** → **Web Service**
3. Connect GitHub repo
4. Configure:
   - **Build Command:** `pip install supervisor && cd backend && pip install -r requirements.txt && cd ../frontend && yarn install && yarn build`
   - **Start Command:** `supervisord -c /app/supervisord.conf -n`
5. Add same environment variables
6. Deploy

---

**Need help?** Check logs first, then review troubleshooting section above.

Good luck! 🚀
