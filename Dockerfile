# Multi-stage build for Runic Resonance
FROM python:3.11-slim as backend-builder

WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM node:18-slim as frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/ .
RUN yarn build

# Final stage
FROM python:3.11-slim

# Install Node.js and supervisor
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install serve for serving static files
RUN npm install -g serve

WORKDIR /app

# Copy backend
COPY backend/ /app/backend/
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# Copy supervisor config
COPY supervisord.conf /app/supervisord.conf

# Expose ports
EXPOSE 8001 3000

# Start supervisor
CMD ["supervisord", "-c", "/app/supervisord.conf", "-n"]
