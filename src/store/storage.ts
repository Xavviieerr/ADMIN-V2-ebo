import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/**
 * SSR-safe storage for redux-persist.
 *
 * `redux-persist/lib/storage` touches `localStorage` at import time, which
 * breaks/falls-back-to-noop when this module graph is evaluated on the
 * server (Next.js App Router evaluates client-module imports during SSR).
 * The `createWebStorage` factory itself is import-safe: it only accesses
 * `window` when invoked, so we invoke it on the client only.
 */
function createNoopStorage() {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<string> {
      return Promise.resolve(value);
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
}

export const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");
