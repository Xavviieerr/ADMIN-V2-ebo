"use client";

import { useState, useEffect } from "react";

export function readStorage(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}

export function readStorageInt(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (stored) {
    const num = parseInt(stored, 10);
    if (!isNaN(num) && num > 0) return num;
  }
  return fallback;
}

function writeStorage(key: string, value: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

/**
 * useState with automatic localStorage persistence.
 * SSR-safe: falls back to `fallback` during server rendering.
 */
export function usePersistedString(key: string, fallback: string) {
  const [value, setValue] = useState(() => readStorage(key, fallback));

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

/**
 * useState<number> with automatic localStorage persistence (stored as string).
 * SSR-safe.
 */
export function usePersistedInt(key: string, fallback: number) {
  const [value, setValue] = useState(() => readStorageInt(key, fallback));

  useEffect(() => {
    writeStorage(key, value.toString());
  }, [key, value]);

  return [value, setValue] as const;
}

/**
 * Bulk-write multiple keys to localStorage.
 * Call this when resetting all filters at once.
 */
export function writeBulkStorage(entries: [string, string][]) {
  entries.forEach(([key, value]) => writeStorage(key, value));
}
