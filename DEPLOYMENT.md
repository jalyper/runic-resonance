# Deployment Guide - Railway

## ⚡ Quick Deploy to Railway

### Prerequisites
- Railway account (sign up at [railway.app](https://railway.app))
- GitHub account  
- Your AWS credentials (for AWS Bedrock AI)
- Your Riot API key (get at [developer.riotgames.com](https://developer.riotgames.com))

### 🚨 Important Note
This app requires:
- **MongoDB** (Railway provides this)
- **AWS Bedrock** access with Claude 3.5 Sonnet and Titan Image Generator
- **Riot Games API key** (free dev key expires in 24 hours)

---

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Runic Resonance"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/runic-resonance.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Railway

### Option A: Via Railway Dashboard (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `runic-resonance` repository
5. Railway will auto-detect the configuration

### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

## Step 3: Add MongoDB Service

1. In your Railway project dashboard
2. Click **"+ New"**
3. Select **"Database"** → **"MongoDB"**
4. Railway will automatically create a MongoDB instance
5. Copy the connection string (format: `mongodb://...`)

---

## Step 4: Configure Environment Variables

In Railway dashboard, go to your service → **Variables** tab:

### Backend Variables:
```
MONGO_URL=<your-railway-mongodb-connection-string>
DB_NAME=runic_resonance
CORS_ORIGINS=*
RIOT_API_KEY=<your-riot-api-key>
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
```

### Frontend Variables:
```
REACT_APP_BACKEND_URL=https://your-app.up.railway.app
```

**Note:** Railway will provide you with a public URL after first deployment. Update `REACT_APP_BACKEND_URL` with that URL and redeploy.

---

## Step 5: Update CORS & Backend URL

After first deployment:

1. Note your Railway URL (e.g., `https://runic-resonance-production.up.railway.app`)
2. Update environment variables:
   - `REACT_APP_BACKEND_URL` = your Railway URL
   - `CORS_ORIGINS` = your Railway URL (or keep as `*` for testing)
3. Click **"Redeploy"** in Railway dashboard

---

## Step 6: Verify Deployment

Once deployed, visit your Railway URL and test:

1. ✅ Landing page loads
2. ✅ Enter a Riot ID (e.g., `Jalyper#piano`)
3. ✅ Analysis completes (may take 30-40 seconds)
4. ✅ Results page displays with AI narrative

---

## Monitoring & Logs

**View Logs:**
- Railway dashboard → Your service → **"Deployments"** tab → Click deployment → **"View Logs"**

**Check Status:**
- Dashboard shows service status (green = healthy)
- Logs show any errors

---

## Cost Management

**Free Tier Limits:**
- Railway: $5 free credit per month
- Estimated usage: ~$0.10-0.50 per analysis (AWS Bedrock)
- Monitor usage at: Railway dashboard → **"Usage"** tab

**After Judging:**
- Delete the Railway project to stop charges
- Or pause the service (dashboard → service → **"Settings"** → **"Pause"**)

---

## Troubleshooting

### Issue: "Module not found" errors
**Solution:** Ensure `requirements.txt` and `package.json` are committed to Git

### Issue: Frontend can't reach backend
**Solution:** 
1. Check `REACT_APP_BACKEND_URL` is set correctly
2. Verify CORS_ORIGINS includes Railway URL
3. Ensure backend routes use `/api` prefix

### Issue: MongoDB connection failed
**Solution:**
1. Verify MongoDB service is running in Railway
2. Copy connection string from MongoDB service variables
3. Update `MONGO_URL` in backend variables

### Issue: AWS Bedrock errors
**Solution:**
1. Verify AWS credentials are correct
2. Check IAM user has `AmazonBedrockFullAccess` policy
3. Confirm region is `us-east-1`

### Issue: Riot API 403 errors
**Solution:**
- Riot dev keys expire in 24 hours
- Get new key at [developer.riotgames.com](https://developer.riotgames.com)
- Update `RIOT_API_KEY` variable in Railway

---

## Alternative: Render.com Deployment

If Railway doesn't work, try Render:

1. Go to [render.com](https://render.com)
2. **New** → **Web Service**
3. Connect GitHub repo
4. Configure:
   - **Build Command:** `cd backend && pip install -r requirements.txt && cd ../frontend && yarn install && yarn build`
   - **Start Command:** `supervisord -c /app/supervisord.conf`
5. Add same environment variables as above
6. Deploy

---

## Security Notes

⚠️ **Important:**
- Your AWS keys will be stored securely by Railway (encrypted)
- Monitor AWS costs during judging period
- Delete deployment after hackathon judging completes
- Consider creating a separate AWS IAM user just for this deployment with limited permissions

---

## Support

If you encounter issues:
1. Check Railway logs first
2. Review `/app/README.md` for local testing
3. Verify all environment variables are set correctly

---

**Your app should be live at:** `https://your-project-name.up.railway.app`

Share this URL in your hackathon submission! 🚀
