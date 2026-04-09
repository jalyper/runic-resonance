#!/usr/bin/env python3
"""Simple process manager for Runic Resonance.

Starts the FastAPI backend (uvicorn on port 8001) and serves the built
frontend bundle (npx serve on port 3000) from the same parent directory
as this script. Ctrl+C cleans up both processes.

Before running, build the frontend once:
    cd frontend && yarn install && yarn build

Then from the repo root:
    python start.py
"""
import os
import signal
import subprocess
import sys
import time
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = REPO_ROOT / "backend"
FRONTEND_DIR = REPO_ROOT / "frontend"


def start_services() -> None:
    print("Starting Runic Resonance...")

    if not BACKEND_DIR.exists():
        sys.exit(f"backend directory not found: {BACKEND_DIR}")
    if not (FRONTEND_DIR / "build").exists():
        sys.exit(
            f"frontend build not found: {FRONTEND_DIR / 'build'}\n"
            "Run `cd frontend && yarn install && yarn build` first."
        )

    print("Starting backend on port 8001...")
    backend = subprocess.Popen(
        ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "1"],
        cwd=str(BACKEND_DIR),
        stdout=sys.stdout,
        stderr=sys.stderr,
    )
    time.sleep(2)

    print("Starting frontend on port 3000...")
    frontend = subprocess.Popen(
        ["npx", "serve", "-s", "build", "-l", "3000"],
        cwd=str(FRONTEND_DIR),
        stdout=sys.stdout,
        stderr=sys.stderr,
    )

    print("Services running:")
    print("  Backend:  http://localhost:8001")
    print("  Frontend: http://localhost:3000")

    def shutdown(_sig=None, _frame=None) -> None:
        print("\nShutting down services...")
        backend.terminate()
        frontend.terminate()
        backend.wait()
        frontend.wait()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        shutdown()


if __name__ == "__main__":
    start_services()
