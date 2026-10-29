"use client";

import { useState, useEffect, useCallback } from "react";
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

/** withJobs: also load the saved jobs themselves (the watchlist drawer); other users need ids only. */
export function useWatchlist({ withJobs = false }: { withJobs?: boolean } = {}) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [fetchedJobs, setFetchedJobs] = useState<JobNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial read
    setSavedIds(getStoredWatchlistIds());
    setIsLoaded(true);

    const handleUpdate = () => {
      setSavedIds(getStoredWatchlistIds());
    };

    window.addEventListener(WATCHLIST_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(WATCHLIST_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const isSaved = useCallback(
    (id: string) => {
      return savedIds.includes(id);
    },
    [savedIds]
  );

  const toggleSave = useCallback(
    (id: string) => {
      setSavedIds((prev) => {
        const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
        saveWatchlistIds(next);
        return next;
      });
    },
    []
  );

  const removeJob = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.filter((item) => item !== id);
      saveWatchlistIds(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSavedIds([]);
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
