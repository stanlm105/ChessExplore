import { useEffect, useRef, useState } from "react";
import { fetchOpenings } from "../api/openingsClient";

const cache = new Map();

/**
 * Fetch and cache openings for a given set bucket.
 * Caches results in-memory by bucket to avoid repeated requests.
 *
 * @param {"starter"|"level2"|"wacky"} [bucket="starter"]
 * @returns {{data: any[], loading: boolean, error: any}}
 */
export function useOpenings(bucket = "starter") {
  const cached = cache.get(bucket);
  const [data, setData] = useState(Array.isArray(cached) ? cached : []);
  const [loading, setLoading] = useState(!Array.isArray(cached));
  const [error, setError] = useState(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;

    if (Array.isArray(cache.get(bucket))) {
      setData(cache.get(bucket));
      setLoading(false);
      return () => { alive.current = false; };
    }

    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    fetchOpenings(bucket, ctrl.signal)
      .then((list) => {
        if (!alive.current) return;
        const arr = Array.isArray(list) ? list : [];
        cache.set(bucket, arr);
        setData(arr);
      })
      .catch((e) => {
        if (!alive.current || e.name === "CanceledError") return;
        setError(e);
        setData([]);
      })
      .finally(() => alive.current && setLoading(false));

    return () => { alive.current = false; ctrl.abort(); };
  }, [bucket]);

  return { data, loading, error };
}
