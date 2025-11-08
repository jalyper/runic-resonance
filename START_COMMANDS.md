# 🚀 Railway Start Commands - All Options

## Current Issue
```
Error: Writing app
Caused by:
Is a directory (os error 21)
```

This happens when Nixpacks tries to auto-generate a start script.

---

## ✅ Solution: Use Explicit Start Commands

Railway.json now specifies the start command explicitly, bypassing Nixpacks auto-generation.

---

## 🎯 Available Start Commands

### Option 1: Python Process Manager (RECOMMENDED)
**Command:**
```bash
python3 start.py
```

**Why this works:**
- ✅ No shell script conflicts
- ✅ Proper process management
- ✅ Graceful shutdown handling
- ✅ Cross-platform compatible

**In Railway:**
- Settings → Deploy → Start Command
- Enter: `python3 start.py`

---

### Option 2: Bash with Supervisor
**Command:**
```bash
bash start.sh
```

**Why this works:**
- ✅ Uses supervisor for auto-restart
- ✅ Proper logging
- ✅ Production-ready

**Requires:**
- Supervisor installed in nixpacks

---

### Option 3: Simple Bash
**Command:**
```bash
bash start-simple.sh
```

**Why this works:**
- ✅ No supervisor dependency
- ✅ Simple & direct
- ✅ Easy to debug

---

### Option 4: Direct Supervisor
**Command:**
```bash
supervisord -c /app/supervisord.conf -n
```

**This is causing the error!**
- ❌ Nixpacks tries to write this as a file
- ❌ Conflicts with `/app` directory
- ❌ Don't use as the start command

---

### Option 5: NPM Start
**Command:**
```bash
npm start
```

**Why this works:**
- ✅ Uses package.json scripts
- ✅ Standard Node.js convention

**Note:** Requires root package.json (now included)

---

## 📝 How to Set Start Command in Railway

### Method 1: Via railway.json (Automatic)
The repository includes `railway.json` with:
```json
{
  "deploy": {
    "startCommand": "python3 start.py"
  }
}
```

Railway will use this automatically.

### Method 2: Manual Override
1. Go to Railway project
2. Click your service
3. Go to "Settings" tab
4. Scroll to "Deploy" section
5. Find "Start Command" field
6. Enter one of the commands above
7. Click "Redeploy"

---

## 🔍 Which Command Should You Use?

### For Railway Deployment:
```
python3 start.py
```
✅ Most reliable
✅ No script conflicts
✅ Proper process management

### For Local Development:
```
bash start-simple.sh
```
✅ Easy to stop/restart
✅ Simple debugging

### For Production (non-Railway):
```
supervisord -c /app/supervisord.conf -n
```
✅ Auto-restart on crash
✅ Professional logging

---

## 🛠️ Testing Start Commands Locally

```bash
# Test Python manager
python3 start.py

# Test bash scripts
bash start.sh
bash start-simple.sh

# Test supervisor directly
supervisord -c supervisord.conf -n
```

---

## 🎯 What Each File Does

| File | Purpose | Process Manager |
|------|---------|----------------|
| `start.py` | Python process manager | ✅ Built-in |
| `start.sh` | Bash + supervisor | ✅ Supervisor |
| `start-simple.sh` | Simple bash | ❌ None |
| `supervisord.conf` | Supervisor config | N/A |

---

## ✅ Recommended Railway Configuration

**railway.json:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python3 start.py",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

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

# NO [start] section - let railway.json handle it!
```

---

## 🐛 Debugging

**If you see "Is a directory" error:**
1. ✅ Remove `[start]` section from nixpacks.toml
2. ✅ Use railway.json with explicit startCommand
3. ✅ Try `python3 start.py` as start command

**If services won't start:**
1. Check Railway logs for errors
2. Verify build completed successfully
3. Try simpler start command: `bash start-simple.sh`

**If only one service starts:**
1. Check port numbers (8001 for backend, 3000 for frontend)
2. Verify frontend build exists: `ls -la frontend/build`
3. Check supervisor logs in Railway

---

## 🚀 Current Configuration

**Active Start Command:** `python3 start.py`

This is set in:
- ✅ railway.json
- ✅ package.json (as default script)
- ✅ Verified working locally

---

## 📊 Start Command Comparison

| Command | Reliability | Setup Complexity | Debug Ease |
|---------|------------|------------------|------------|
| `python3 start.py` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| `bash start.sh` | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| `bash start-simple.sh` | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| `supervisord -c...` | ❌ | ⭐⭐ | ⭐⭐ |

---

**Current Recommendation:** Use `python3 start.py` - It's configured and ready to go! 🚀
