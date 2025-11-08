#!/bin/bash
set -e

echo "🚀 Starting Runic Resonance..."

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start supervisord with absolute path
exec supervisord -c "$DIR/supervisord.conf" -n
