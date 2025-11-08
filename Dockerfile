# Multi-stage build for Runic Resonance
FROM python:3.11-slim as backend-builder

WORKDIR /app
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

FROM node:18-slim as frontend-builder

WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./frontend/
RUN cd frontend && yarn install --frozen-lockfile
COPY frontend/ ./frontend/
RUN cd frontend && yarn build

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
