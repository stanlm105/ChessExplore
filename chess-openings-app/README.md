# Chess Openings App (single-container)

Learn chess openings with animated moves and multiple-choice identification. The app now builds the React frontend and serves it from the Flask backend so you can deploy a single container to Google Cloud Run.

## Overview

- Frontend: React + Vite + `react-chessboard`
- Backend: Flask API serving opening sets and static frontend assets
- One container image built from the repo root `Dockerfile`

## Local Development

Option A — run everything via Docker (matches production):

```zsh
docker build -t chess-openings-app -f Dockerfile .
docker run --rm -p 8000:8000 -e PORT=8000 chess-openings-app
# Open http://localhost:8000 (frontend) and try http://localhost:8000/api/openings/starter
```

Option A2 — using docker-compose (same as above, with one command):

```zsh
docker compose up --build
# Ctrl+C to stop; add -d to run detached
```

Option B — run frontend + backend separately for fast dev cycles:

```zsh
# Backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
PORT=8000 python -m backend.app

# Frontend (in a second terminal)
cd frontend
npm install
npm run dev
# Open http://localhost:5173 — Vite proxies /api to http://localhost:8000
```

## Deploy to Google Cloud Run

Prereqs (one-time):

```zsh
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
gcloud artifacts repositories create webapps --repository-format=docker --location=us-central1
```

Build and push with Cloud Build:

```zsh
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/webapps/chess-openings-app:latest .
```

Deploy to Cloud Run:

```zsh
gcloud run deploy chess-openings-app \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/webapps/chess-openings-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

Cloud Run injects `PORT`. The container serves the React build and the API on the same origin at `/api/...`.

## Notes

- Root `.dockerignore` keeps images small; subdir `.dockerignore` files apply only if you build from those subfolders as the context.
- For production, the container runs with Gunicorn: `backend.app:app` bound to `0.0.0.0:$PORT`.
- The Flask app has a catch‑all route that serves the SPA `index.html` so client-side routing works.