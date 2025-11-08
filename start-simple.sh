#!/bin/bash
set -e

echo "🚀 Starting Runic Resonance (Simple Mode)..."

# Start backend in background
cd /app/backend
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1 &
BACKEND_PID=$!

# Start frontend
cd /app/frontend
npx serve -s build -l 3000 &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
