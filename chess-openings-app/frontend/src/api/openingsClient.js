import axios from "axios";

/**
 * Base URL for the backend API. Defaults to same-origin '/api' which works
 * both in local dev (Vite proxy) and in the single-container deployment.
 * @type {string}
 */
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/**
 * Fetch all openings for a given set bucket.
 * @param {"starter"|"level2"|"wacky"} [bucket="starter"] - Opening set key.
 * @param {AbortSignal} [signal] - Optional abort signal.
 * @returns {Promise<Array<{name:string, moves:string[], description:string}>>}
 */
export async function fetchOpenings(bucket = "starter", signal) {
  const url = `${API_BASE}/openings/${bucket}`;
  const res = await axios.get(url, { signal });
  const payload = res.data;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.openings)) return payload.openings;
  return [];
}

/**
 * Fetch a single opening by 1-based index from a set.
 * Mirrors backend route GET /api/openings/:setType/move/:moveNumber
 * @param {"starter"|"level2"|"wacky"} setType
 * @param {number} moveNumber - 1-based index of the opening in the set
 * @param {AbortSignal} [signal]
 * @returns {Promise<{name:string, moves:string[], description:string}>}
 */
export async function getMove(setType, moveNumber, signal) {
  const url = `${API_BASE}/openings/${setType}/move/${moveNumber}`;
  const res = await axios.get(url, { signal });
  return res.data;
}
