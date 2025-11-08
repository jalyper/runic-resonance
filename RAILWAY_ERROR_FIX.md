# 🔧 Railway "Is a directory" Error Fix

## Error Message
```
Error: Writing app
Caused by:
Is a directory (os error 21)
```

## What This Means
Nixpacks is trying to write a start script but encountering a path/directory conflict. This commonly happens with monorepo structures.

---

## ✅ Solutions (Try in Order)

### Solution 1: Use start.sh Script (Recommended)

The repository now includes `start.sh` which handles paths correctly.

**Verify these files exist:**
```bash
ls -la start.sh
ls -la supervisord.conf
ls -la nixpacks.toml
```

**The nixpacks.toml should have:**
```toml
[start]
cmd = "bash start.sh"
```

### Solution 2: Simplify Start Command

If supervisor causes issues, try the simpler version:

1. Update `nixpacks.toml`:
```toml
[start]
cmd = "bash start-simple.sh"
```

2. This uses a basic process manager without supervisor

### Solution 3: Manual Configuration in Railway

1. Go to Railway Settings → Deploy
2. Under "Start Command", manually enter:
```bash
bash start.sh
```

3. Or for simple version:
```bash
cd /app && bash start-simple.sh
```

### Solution 4: Split Services

Deploy backend and frontend as separate Railway services:

**Backend Service:**
```bash
cd backend && uvicorn server:app --host 0.0.0.0 --port 8001
```

**Frontend Service:**
```bash
cd frontend && npx serve -s build -l 3000
```

---

## 🔍 Debugging Steps

### 1. Check Railway Logs

Look for these key indicators:
```
✓ Installing dependencies
✓ Building frontend
✗ Error: Writing app
```

### 2. Verify File Permissions

Ensure scripts are executable:
```bash
chmod +x start.sh
chmod +x start-simple.sh
chmod +x build.sh
```

### 3. Check Working Directory

Railway uses `/app` as the working directory. Verify paths in:
- `supervisord.conf` - should use `/app/backend` and `/app/frontend`
- `start.sh` - should handle relative to script location

### 4. Test Locally

```bash
# Install dependencies
pip install supervisor uvicorn
pip install -r backend/requirements.txt
cd frontend && yarn install && yarn build && cd ..

# Test start script
bash start.sh
```

---

## 🎯 What Each Start Method Does

### start.sh (with supervisor)
- ✅ Manages both backend + frontend
- ✅ Auto-restarts on crash
- ✅ Proper logging
- ⚠️ More complex

### start-simple.sh (without supervisor)
- ✅ Simple process management
- ✅ No external dependencies
- ✅ Easier to debug
- ⚠️ No auto-restart

---

## 📝 Files to Check

**Required Files:**
- [ ] `nixpacks.toml` (build configuration)
- [ ] `start.sh` (start script with supervisor)
- [ ] `start-simple.sh` (alternative without supervisor)
- [ ] `supervisord.conf` (supervisor config)
- [ ] `Procfile` (Heroku/Railway config)

**Make Sure These Are Executable:**
```bash
chmod +x start.sh
chmod +x start-simple.sh
chmod +x build.sh
```

---

## 🚀 Recommended Configuration

**nixpacks.toml:**
```toml
[phases.setup]
nixPkgs = ["python311", "nodejs-18_x", "yarn"]

[phases.install]
cmds = [
    "pip install --no-cache-dir supervisor uvicorn",
    "pip install --no-cache-dir -r backend/requirements.txt",
    "yarn --cwd frontend install"
]

[phases.build]
cmds = [
    "yarn --cwd frontend build"
]

[start]
cmd = "bash start.sh"
```

**Procfile:**
```
web: bash start.sh
```

---

## 💡 Why This Error Happens

1. **Monorepo Structure**: Nixpacks auto-detection can get confused with multiple package.json/requirements.txt
2. **Path Issues**: Default working directory assumptions don't match monorepo layout
3. **Script Generation**: Nixpacks tries to create a start script but conflicts with existing files/directories

---

## ✅ After Fixing

Once deployed successfully, you should see:
```
✓ Installing dependencies
✓ Building frontend  
✓ Starting application
✓ Backend running on port 8001
✓ Frontend running on port 3000
```

---

## 🆘 Still Not Working?

### Option A: Use Dockerfile Instead

Rename `Dockerfile.alternative` back to `Dockerfile`:
```bash
mv Dockerfile.alternative Dockerfile
```

Then in Railway:
- Settings → Builder → Select "Dockerfile"

### Option B: Deploy to Render.com

If Railway continues to have issues, try Render:
1. Same config files work
2. Often more forgiving with monorepos
3. See `DEPLOYMENT.md` for Render instructions

---

**Need more help?** Check the build logs in Railway dashboard for specific error messages.
