# Root Dockerfile: build frontend and serve via Flask/Gunicorn

# --- Stage 1: build React frontend ---
FROM node:20-alpine AS fe-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Python runtime ---
FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# System deps kept minimal
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install Python deps (better caching)
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend
COPY backend/ ./backend/
# Copy built frontend into a static dir sibling to backend
COPY --from=fe-build /frontend/dist ./static

# Cloud Run sets PORT; fallback for local
ENV PORT=8000

# Run with Gunicorn (production)
CMD gunicorn -b 0.0.0.0:${PORT:-8000} -w 2 backend.app:app
