// filepath: 
# Chess Openings App Backend

This is the backend component of the Chess Openings App, which provides users with a selection of chess openings to learn and practice.

## Setup (local)

1. Clone the repository:
   ```
   git clone <repository-url>
   cd chess-openings-app
   ```

2. Create and activate a virtual environment (macOS/Linux):
   ```
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r backend/requirements.txt
   ```

4. Run the application (module form recommended):
   ```
   python -m backend.app
   ```
   - Default port: `8000`
   - Or set a custom port:
     ```
     PORT=8080 python -m backend.app
     ```

   Alternative (Flask CLI):
   ```
   export FLASK_APP=backend.app
   flask run --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`.

## API Endpoints

- `GET /api/openings/<set_type>` where `<set_type>` ∈ {`starter`, `level2`, `wacky`}
- `GET /api/openings/<set_type>/move/<int:move_number>`
- `GET /healthz` — liveness probe

## CORS

CORS is enabled for `http://localhost:*` by default (suitable for Vite dev server).

## Run in Docker (single container)

Build from repo root (uses root Dockerfile and .dockerignore):
```
docker build -t chess-openings-app -f Dockerfile .
```

Run:
```
docker run --rm -p 8000:8000 -e PORT=8000 chess-openings-app
```

Health check:
```
curl http://localhost:8000/healthz
```

## Notes

- Use a single virtual environment (e.g., `.venv`) to avoid confusion.
- For production, a WSGI server (e.g., `gunicorn`) is recommended.