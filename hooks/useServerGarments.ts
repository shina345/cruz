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

const STORAGE_KEY = "cruz_garments";

/** Read all garments from localStorage */
export function readLocalGarments(): ServerGarment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Write garments array to localStorage */
export function writeLocalGarments(garments: ServerGarment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(garments));
}

/**
 * Hook that reads garments from localStorage and re-renders on updates.
 * Pass a category string to filter, or omit for all garments.
 */
export function useServerGarments(category?: string) {
  const [garments, setGarments] = useState<ServerGarment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    setLoading(true);
    const all = readLocalGarments();
    const filtered = category ? all.filter((g) => g.category === category) : all;
    setGarments(filtered);
    setLoading(false);
  }, [category, refreshKey]);

  // Also re-load when the custom storage event fires
  useEffect(() => {
    const handler = () => {
      const all = readLocalGarments();
      const filtered = category ? all.filter((g) => g.category === category) : all;
      setGarments(filtered);
    };
    window.addEventListener("cruz_garments_updated", handler);
    return () => window.removeEventListener("cruz_garments_updated", handler);
  }, [category]);

  return { garments, loading, error: null, refresh };
}
