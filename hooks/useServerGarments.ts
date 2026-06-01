"use client";

import { useEffect, useState, useCallback } from "react";

export interface ServerGarment {
  id: string;
  title: string;
  img: string;
  category: string;
  look: string;
  mt?: string;
  createdAt: string;
}

/**
 * Fetches garments from the server-side JSON store.
 * Pass a category string to filter, or omit for all garments.
 * Automatically re-fetches when `refreshKey` changes.
 */
export function useServerGarments(category?: string) {
  const [garments, setGarments] = useState<ServerGarment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = category
      ? `/api/garments?category=${encodeURIComponent(category)}`
      : "/api/garments";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: ServerGarment[]) => {
        if (!cancelled) setGarments(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [category, refreshKey]);

  return { garments, loading, error, refresh };
}
