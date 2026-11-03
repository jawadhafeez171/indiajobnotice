"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { JobNotification } from "@/data/jobs";

const STORAGE_KEY = "indiajobnotice_watchlist_ids";
const WATCHLIST_EVENT = "indiajobnotice_watchlist_changed";

export function getStoredWatchlistIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to read watchlist from localStorage", e);
    return [];
  }
}

export function saveWatchlistIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(WATCHLIST_EVENT, { detail: ids }));
  } catch (e) {
    console.error("Failed to save watchlist to localStorage", e);
  }
}

// The saved ids live in the browser's storage: read them as an external store, so every component
// using the hook (and other tabs, through the "storage" event) sees the same list.
const NONE: string[] = [];
let cache: { raw: string | null; ids: string[] } = { raw: null, ids: NONE };

function readIds(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return NONE;
  }
  // the same array while the stored text is unchanged (the store must not hand out a new one each read)
  if (raw !== cache.raw) cache = { raw, ids: raw ? getStoredWatchlistIds() : NONE };
  return cache.ids;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(WATCHLIST_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(WATCHLIST_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const noSubscribe = () => () => {};

/** withJobs: also load the saved jobs themselves (the watchlist drawer); other users need ids only. */
export function useWatchlist({ withJobs = false }: { withJobs?: boolean } = {}) {
  const savedIds = useSyncExternalStore(subscribe, readIds, () => NONE);
  // false while rendering on the server and before the browser has read the storage
  const isLoaded = useSyncExternalStore(noSubscribe, () => true, () => false);
  const [fetchedJobs, setFetchedJobs] = useState<JobNotification[]>([]);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleSave = useCallback((id: string) => {
    const prev = readIds();
    saveWatchlistIds(prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }, []);

  const removeJob = useCallback((id: string) => {
    saveWatchlistIds(readIds().filter((item) => item !== id));
  }, []);

  const clearAll = useCallback(() => {
    saveWatchlistIds([]);
  }, []);

  // Jobs live in the database, so the saved ones are fetched by id (a job taken down drops out)
  useEffect(() => {
    if (!withJobs || savedIds.length === 0) return;
    let cancelled = false;
    fetch(`/api/jobs?ids=${encodeURIComponent(savedIds.join(","))}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((jobs: JobNotification[]) => {
        if (!cancelled) setFetchedJobs(jobs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [withJobs, savedIds]);
  const savedJobs = savedIds
    .map((id) => fetchedJobs.find((j) => j.id === id || j.slug === id))
    .filter((j): j is JobNotification => Boolean(j));

  return {
    savedIds,
    savedJobs,
    savedCount: savedIds.length,
    isLoaded,
    isSaved,
    toggleSave,
    removeJob,
    clearAll,
  };
}
