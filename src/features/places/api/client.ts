// Centralized HTTP for the Places feature.
// Uses the app's existing auth source of truth (accessToken cookie) and BASE_URL:
// - Server Components pass `await getServerAccessToken()` (next/headers cookies).
// - Client handlers pass `tokenStorage.getAccessToken()` read INSIDE the handler.
// No refresh flow is added here: raw fetches never had the RTK reauth behavior,
// and changing login/refresh semantics is out of scope. The backend stays authoritative.

import { BASE_URL } from "@/utils/constants";
import { readJsonSafe, throwForResponse } from "./errors";

export type ApiToken = string | null | undefined;

function authHeaders(token: ApiToken): HeadersInit {
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

function missingTokenError(path: string) {
  return new Error(`Missing access token for ${path}: redirect to login`);
}

export async function apiGet<T>(path: string, token: ApiToken, fallback: string): Promise<T> {
  if (!token) throw missingTokenError(path);
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: authHeaders(token),
  });
  if (!res.ok) await throwForResponse(res, path, fallback);
  const body = await readJsonSafe(res);
  return (body as { data: T }).data;
}

export async function apiSend<T>(
  path: string,
  method: "POST" | "PATCH",
  payload: unknown,
  token: ApiToken,
  fallback: string,
): Promise<T> {
  if (!token) throw missingTokenError(path);
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await throwForResponse(res, path, fallback);
  const body = await readJsonSafe(res);
  return (body as { data: T }).data;
}

/** DELETE helper: handles 204 empty responses without JSON parsing. */
export async function apiDelete(path: string, token: ApiToken, fallback: string): Promise<void> {
  if (!token) throw missingTokenError(path);
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) await throwForResponse(res, path, fallback);
}

export type PlaceImageSizes = {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  original: string;
};

/**
 * Multipart image upload for places.
 * Verified live: 201 returns the raw sizes object (NO {data} envelope).
 * Field name is `imageFile`; preferredFormat/quality are optional.
 */
export async function apiUploadPlaceImage(
  file: File,
  token: ApiToken,
  options?: { preferredFormat?: string; quality?: number },
): Promise<PlaceImageSizes> {
  if (!token) throw missingTokenError("/places/image/upload");
  const form = new FormData();
  form.append("imageFile", file);
  if (options?.preferredFormat) form.append("preferredFormat", options.preferredFormat);
  if (options?.quality !== undefined) form.append("quality", String(options.quality));
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/places/image/upload`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) await throwForResponse(res, "/places/image/upload", "Failed to upload image");
  return (await readJsonSafe(res)) as PlaceImageSizes;
}
