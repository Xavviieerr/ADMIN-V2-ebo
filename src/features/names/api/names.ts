// Ownership for all /names endpoints (verified live contracts).
// Query params are URL-encoded via URLSearchParams; only defined values are sent.
// Failures throw NamesApiError (never []) so 404/403/400 stay distinguishable.

import type { NameRecord, NamesStats, SingleName } from "../model/types";
import { apiDelete, apiGet, apiSend, type ApiToken } from "./request";

export type ListNamesParams = {
  search?: string;
  page?: number | string;
  limit?: number;
  sortBy?: string;
  sortDir?: string;
  nameType?: string;
  status?: string;
};

export function buildNamesQuery(params: ListNamesParams): string {
  const query = new URLSearchParams();
  if (params.search !== undefined && params.search !== "") query.set("search", params.search);
  if (params.page !== undefined && params.page !== "") query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortDir) query.set("sortDir", params.sortDir);
  if (params.nameType) query.set("nameType", params.nameType);
  if (params.status) query.set("status", params.status);
  const encoded = query.toString();
  return encoded ? `/names?${encoded}` : "/names";
}

export type CreateTranslationInput = {
  targetLanguage: string;
  equivalentName: string;
  translatedMeaning: string;
  priority: number;
  isPrimary: boolean;
  notes: string;
};

export type CreateNameInput = {
  nameType: string;
  name: string;
  regionOfUse: string;
  gender: string;
  culturalSignificance: string;
  pronunciation: string;
  syllableCount: number;
  nameComposition: string[];
  translations: CreateTranslationInput[];
  abbreviations: string[];
  notableBearers: string[];
  alternativeSpellings: string[];
  relatedNames: string[];
  nicknames: string[];
  // Backend-accepted extras (meaning, origin story, ranks, usage, notes).
  meaning?: string;
  nameOriginStory?: string;
  popularityRank?: number;
  historicalUsage?: string;
  modernUsage?: string;
  astrologicalAssociations?: string[];
  commonMisspellings?: string[];
  linguisticNotes?: string;
  culturalNotes?: string;
  otherNotes?: string;
};

// Main PATCH must NEVER carry translations: backend rejects
// `property translations should not exist` (verified 400).
export type UpdateNameInput = Omit<CreateNameInput, "translations">;

export async function fetchNamesStats(token: ApiToken): Promise<NamesStats> {
  return apiGet<NamesStats>("/names/stats", token, "Failed to fetch name statistics");
}

export async function fetchNames(
  params: ListNamesParams,
  token: ApiToken,
): Promise<NameRecord> {
  return apiGet<NameRecord>(
    buildNamesQuery({ limit: 10, sortBy: "name", ...params }),
    token,
    "Failed to fetch names",
  );
}

export async function fetchSingleName(token: ApiToken, id: string): Promise<SingleName> {
  return apiGet<SingleName>(`/names/${id}`, token, "Failed to fetch name");
}

export async function createName(input: CreateNameInput, token: ApiToken): Promise<SingleName> {
  return apiSend<SingleName>("/names", "POST", input, token, "Failed to create name");
}

export async function updateName(
  id: string,
  input: UpdateNameInput,
  token: ApiToken,
): Promise<SingleName> {
  return apiSend<SingleName>(`/names/${id}`, "PATCH", input, token, "Failed to update name");
}

export async function approveName(id: string, token: ApiToken): Promise<SingleName> {
  return apiSend<SingleName>(`/names/${id}/approve`, "PATCH", {}, token, "Failed to approve name");
}

export async function rejectName(id: string, reason: string, token: ApiToken): Promise<SingleName> {
  return apiSend<SingleName>(
    `/names/${id}/reject`,
    "PATCH",
    { reason },
    token,
    "Failed to reject name",
  );
}

export async function deleteName(id: string, token: ApiToken): Promise<void> {
  await apiDelete(`/names/${id}`, token, "Failed to delete name");
}
