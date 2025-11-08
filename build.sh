#!/bin/bash
set -e

echo "🔧 Installing dependencies..."

# Install Python dependencies
echo "📦 Installing Python packages..."
cd /app/backend
pip install -r requirements.txt

# Install Node dependencies
echo "📦 Installing Node packages..."
cd /app/frontend
yarn install

# Build frontend
echo "🏗️ Building frontend..."
yarn build

echo "✅ Build complete!"
