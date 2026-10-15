// Ownership for all /places endpoints used by the admin dashboard.
// Contracts verified live against the dev backend:
// - Envelope is {data, message} on success; validation 400s carry message[].
// - DELETE returns 204 with an empty body.
// - Image upload returns the raw sizes object (NO {data} envelope).
// - Related DELETE takes the related PLACE id and 204s even on no-ops:
//   callers must re-fetch to verify state.
// - sortBy bogus is silently ignored; sortDir outside ASC/DESC/asc/desc 400s.

import type {
  ClaimsPage,
  OwnershipClaim,
  PlaceDetail,
  PlacesPage,
  PlaceStats,
  RelatedLink,
  ReviewsPage,
} from "../model/types";
import { apiDelete, apiGet, apiSend, apiUploadPlaceImage, type ApiToken, type PlaceImageSizes } from "./client";

export type ListPlacesParams = {
  search?: string;
  page?: number | string;
  limit?: number;
  sortBy?: string;
  sortDir?: string;
  type?: string;
  status?: string;
  createdBy?: string;
};

export function buildPlacesQuery(params: ListPlacesParams): string {
  const query = new URLSearchParams();
  if (params.search !== undefined && params.search !== "")
    query.set("search", params.search);
  if (params.page !== undefined && params.page !== "") query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortDir) query.set("sortDir", params.sortDir);
  if (params.type) query.set("type", params.type);
  if (params.status) query.set("status", params.status);
  if (params.createdBy) query.set("createdBy", params.createdBy);
  const encoded = query.toString();
  return encoded ? `/places?${encoded}` : "/places";
}

export async function fetchPlacesStats(token: ApiToken): Promise<PlaceStats | null> {
  const data = await apiGet<PlaceStats>("/places/stats", token, "Failed to fetch place statistics");
  return data ?? null;
}

export async function fetchPlacesList(params: ListPlacesParams, token: ApiToken): Promise<PlacesPage> {
  return apiGet<PlacesPage>(
    buildPlacesQuery({ limit: 10, sortBy: "createdAt", sortDir: "ASC", ...params }),
    token,
    "Failed to fetch places",
  );
}

export async function fetchSinglePlace(token: ApiToken, id: string): Promise<PlaceDetail> {
  return apiGet<PlaceDetail>(`/places/${id}`, token, "Failed to fetch place");
}

export type BusinessProfileInput = {
  phoneNumber?: string | null;
  email?: string | null;
  website?: string | null;
  category: string;
  logo?: string | null;
  openingHours?: Record<string, { open?: string; close?: string; closed?: boolean }> | null;
};

export type CreatePlaceInput = {
  name: string;
  description: string;
  type: string;
  coverImage?: string | null;
  images?: string[];
  tags?: string[];
  location?: {
    city?: string;
    state?: string;
    country?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  businessProfile?: BusinessProfileInput | null;
};

export async function createPlace(input: CreatePlaceInput, token: ApiToken): Promise<PlaceDetail> {
  return apiSend<PlaceDetail>("/places", "POST", input, token, "Failed to create place");
}

// Only confirmed-supported record fields. Never send businessProfile here:
// nested profile objects are silently ignored on profile-less places and the
// dedicated PATCH /:id/business-profile is owner-gated (admin 403).
export async function updatePlace(
  id: string,
  input: Partial<Omit<CreatePlaceInput, "businessProfile">>,
  token: ApiToken,
): Promise<PlaceDetail> {
  return apiSend<PlaceDetail>(`/places/${id}`, "PATCH", input, token, "Failed to update place");
}

export async function approvePlace(id: string, token: ApiToken): Promise<PlaceDetail> {
  return apiSend<PlaceDetail>(`/places/${id}/approve`, "PATCH", {}, token, "Failed to approve place");
}

export async function rejectPlace(id: string, reason: string, token: ApiToken): Promise<PlaceDetail> {
  return apiSend<PlaceDetail>(`/places/${id}/reject`, "PATCH", { reason }, token, "Failed to reject place");
}

export async function verifyPlace(id: string, status: string, token: ApiToken): Promise<PlaceDetail> {
  return apiSend<PlaceDetail>(`/places/${id}/verify`, "PATCH", { status }, token, "Failed to verify place");
}

export async function deletePlace(id: string, token: ApiToken): Promise<void> {
  await apiDelete(`/places/${id}`, token, "Failed to delete place");
}

export async function fetchClaims(
  params: { status?: string; page?: number; limit?: number },
  token: ApiToken,
): Promise<ClaimsPage> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.page !== undefined) query.set("page", String(params.page));
  query.set("limit", String(params.limit ?? 10));
  const qs = query.toString();
  return apiGet<ClaimsPage>(`/places/claims${qs ? `?${qs}` : ""}`, token, "Failed to fetch claims");
}

export async function approveClaim(claimId: string, token: ApiToken): Promise<OwnershipClaim> {
  return apiSend<OwnershipClaim>(`/places/claims/${claimId}/approve`, "PATCH", {}, token, "Failed to approve claim");
}

export async function rejectClaim(claimId: string, reason: string, token: ApiToken): Promise<OwnershipClaim> {
  return apiSend<OwnershipClaim>(`/places/claims/${claimId}/reject`, "PATCH", { reason }, token, "Failed to reject claim");
}

export async function fetchReviews(
  placeId: string,
  params: { page?: number; limit?: number },
  token: ApiToken,
): Promise<ReviewsPage> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  query.set("limit", String(params.limit ?? 10));
  return apiGet<ReviewsPage>(`/places/${placeId}/reviews?${query.toString()}`, token, "Failed to fetch reviews");
}

export async function deleteReview(placeId: string, reviewId: string, token: ApiToken): Promise<void> {
  await apiDelete(`/places/${placeId}/reviews/${reviewId}`, token, "Failed to delete review");
}

export async function addRelatedPlace(
  placeId: string,
  relatedPlaceId: string,
  note: string | undefined,
  token: ApiToken,
): Promise<RelatedLink> {
  return apiSend<RelatedLink>(
    `/places/${placeId}/related`,
    "POST",
    note ? { relatedPlaceId, note } : { relatedPlaceId },
    token,
    "Failed to add related place",
  );
}

export async function removeRelatedPlace(placeId: string, relatedPlaceId: string, token: ApiToken): Promise<void> {
  await apiDelete(`/places/${placeId}/related/${relatedPlaceId}`, token, "Failed to remove related place");
}

export async function uploadPlaceImage(
  file: File,
  token: ApiToken,
  options?: { preferredFormat?: string; quality?: number },
): Promise<PlaceImageSizes> {
  return apiUploadPlaceImage(file, token, options);
}
