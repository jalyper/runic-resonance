#!/usr/bin/env python3
"""
Simple process manager for Runic Resonance
Starts backend and frontend processes
"""
import subprocess
import sys
import os
import signal
import time

def start_services():
    """Start backend and frontend services"""
    print("🚀 Starting Runic Resonance...")
    
    # Change to app directory
    os.chdir('/app')
    
    # Start backend
    print("📦 Starting backend on port 8001...")
    backend = subprocess.Popen(
        ['uvicorn', 'server:app', '--host', '0.0.0.0', '--port', '8001', '--workers', '1'],
        cwd='/app/backend',
        stdout=sys.stdout,
        stderr=sys.stderr
    )
    
    # Give backend time to start
    time.sleep(2)
    
    # Start frontend
    print("🎨 Starting frontend on port 3000...")
    frontend = subprocess.Popen(
        ['npx', 'serve', '-s', 'build', '-l', '3000'],
        cwd='/app/frontend',
        stdout=sys.stdout,
        stderr=sys.stderr
    )
    
    print("✅ Services started!")
    print("   Backend: http://0.0.0.0:8001")
    print("   Frontend: http://0.0.0.0:3000")
    
    def signal_handler(sig, frame):
        """Handle shutdown gracefully"""
        print("\n🛑 Shutting down services...")
        backend.terminate()
        frontend.terminate()
        backend.wait()
        frontend.wait()
        sys.exit(0)
    
    # Handle shutdown signals
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Wait for both processes
    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == '__main__':
    start_services()
