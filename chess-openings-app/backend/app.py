"""Flask API for serving chess opening sets.

Endpoints:
- GET /api/openings/<set_type>
- GET /api/openings/<set_type>/move/<int:move_number>
- GET /healthz
"""
from __future__ import annotations

import os
import logging
from typing import Dict, List, Any, Tuple
from flask import Flask, jsonify, Response, request, send_from_directory
from flask_cors import CORS

# Prefer absolute import when run as a module; keep relative as fallback for some runners.
try:
    from openings.openings_data import get_openings as get_openings_from_data
except Exception:  # pragma: no cover
    from .openings.openings_data import get_openings as get_openings_from_data  # type: ignore

# Configure static folder to point to repo-root/static (in container) if present.
_HERE = os.path.dirname(__file__)
_STATIC_DIR = os.path.abspath(os.path.join(_HERE, "..", "static"))
app = Flask(__name__, static_folder=_STATIC_DIR, static_url_path="")

# Enable CORS for the frontend (Vite default ports). Adjust as needed.
CORS(
    app,
    resources={r"/api/*": {"origins": [r"http://localhost:*", r"http://127.0.0.1:*"]}},
)

# Map URL slugs → verbose names used by openings_data.py
SET_NAME_MAP: Dict[str, str] = {
    "starter": "Starter Opening Set",
    "level2": "Level 2 Set",
    "wacky": "Wacky Set",
}


def _resolve_set_name(set_type: str) -> Tuple[str | None, Response | None]:
    """Resolve a URL set_type slug to a canonical set name or return a JSON 400.

    Returns:
        (set_name, None) on success, or (None, error_response) on failure.
    """
    set_name = SET_NAME_MAP.get(set_type)
    if not set_name:
        return None, jsonify({"error": f"invalid opening set type: {set_type}"}),  # type: ignore[return-value]
    return set_name, None  # type: ignore[return-value]


@app.get("/healthz")
def healthz() -> Response:
    """Lightweight liveness probe used by containers and GCS."""
    return jsonify({"status": "ok"})


@app.get("/api/openings/<set_type>")
def api_get_openings(set_type: str) -> Response:
    """Return all openings for the requested set.

    Path params:
        set_type: One of {"starter", "level2", "wacky"}.

    Response JSON:
        { "openings": [ { "name": str, "moves": [str], "description": str }, ... ] }
    """
    set_name, err = _resolve_set_name(set_type)
    if err:
        return err  # 400

    openings_list: List[Dict[str, Any]] = get_openings_from_data(set_name)  # list[dict]
    return jsonify({"openings": openings_list})


@app.get("/api/openings/<set_type>/move/<int:move_number>")
def api_get_move(set_type: str, move_number: int) -> Response:
    """Return a single opening by 1-based index within the set.

    Path params:
        set_type: opening set slug
        move_number: 1-based index into the list of openings within the set

    Returns:
        JSON object for the requested opening, or 400 if out of range.
    """
    set_name, err = _resolve_set_name(set_type)
    if err:
        return err  # 400

    openings_list: List[Dict[str, Any]] = get_openings_from_data(set_name)
    idx = move_number - 1
    if idx < 0 or idx >= len(openings_list):
        return jsonify({"error": f"invalid move_number: {move_number}"}), 400

    return jsonify(openings_list[idx])


# ---- Static frontend (SPA) ----
@app.get("/")
@app.get("/<path:path>")
def serve_frontend(path: str | None = None):
    """Serve the built frontend from the static folder with SPA fallback.

    If the requested asset exists under the static directory, serve it.
    Otherwise, return index.html so client-side routing works.
    When developing the backend without a built frontend, return a hint.
    """
    if app.static_folder and os.path.exists(app.static_folder):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        index_path = os.path.join(app.static_folder, "index.html")
        if os.path.exists(index_path):
            return send_from_directory(app.static_folder, "index.html")
    return jsonify({
        "message": "Frontend build not found. Run `npm run build` in frontend/ or use Vite dev server.",
        "api_example": "/api/openings/starter"
    })


@app.errorhandler(404)
def not_found(_: Exception) -> Response:
    """Return JSON for unknown routes."""
    return jsonify({"error": "not found"}), 404


@app.errorhandler(500)
def server_error(e: Exception) -> Response:
    """Return JSON for unexpected server errors."""
    app.logger.exception("Unhandled exception: %s", e)
    return jsonify({"error": "internal server error"}), 500


if __name__ == "__main__":
    # Prefer env PORT for containers/Cloud Run. Fall back to 8000.
    port = int(os.environ.get("PORT", "8000"))
    # Log to stdout in containers
    logging.basicConfig(level=os.environ.get("LOGLEVEL", "INFO"))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG", "0") == "1")