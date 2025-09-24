import React from "react";
import { useOpenings } from "../hooks/useOpenings";

/**
 * Dropdown and list for selecting an opening from a given set bucket.
 * Fetches with `useOpenings(bucket)` and calls `onSelect(opening)` on click.
 *
 * @param {{
 *   bucket?: 'starter'|'level2'|'wacky',
 *   onSelect?: (opening: {name:string,moves:string[],description:string}) => void
 * }} props
 */

export default function OpeningSelector({
  bucket = "starter",
  onSelect,
}) {
  const { data, loading, error } = useOpenings(bucket);

  if (loading) return <div className="p-2 text-sm">Loading openings…</div>;
  if (error) return (
    <div className="p-2 text-sm text-red-700">
      Failed to load openings: {String(error.message || error)}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="text-sm">Loaded openings: {data?.length ?? 0}</div>
      <ul className="flex flex-wrap gap-2">
        {data.map((o) => (
          <li key={o.name}>
            <button
              className="px-2 py-1 border rounded hover:bg-gray-50"
              onClick={() => onSelect?.(o)}
              title={o.description}
            >
              {o.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
