# Runic Resonance - Railway Deployment
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yarn globally
RUN npm install -g yarn serve

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app/

# Install Python dependencies
RUN cd /app/backend && pip install --no-cache-dir -r requirements.txt

# Install Node dependencies and build frontend
RUN cd /app/frontend && yarn install --frozen-lockfile && yarn build

# Expose ports
EXPOSE 8001 3000

# Start supervisor
CMD ["supervisord", "-c", "/app/supervisord.conf", "-n"]
