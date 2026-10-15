// Ownership for all /figures endpoints used by the admin dashboard.
// Verified contracts: envelope {data,message}; stats at /figures/stats carry
// the grand total; unsupported filters (hasImage/hasAudio/gender/submissionType)
// 400 and are never sent; sortDir must be ASC|DESC|asc|desc.

import type { FigureDetail, FiguresPage, FigureStats } from "../model/types";
import { apiDelete, apiGet, apiSend, apiUploadFigureImage, type ApiToken, type FigureImageSizes as FigureSizes } from "./client";
import type { FigureCreateInput } from "../model/payload";

export type { FigureImageSizes } from "./client";

export type ListFiguresParams = {
  search?: string;
  page?: number | string;
  limit?: number;
  sortBy?: string;
  sortDir?: string;
  occupation?: string;
  status?: string;
  createdBy?: string;
};

export function buildFiguresQuery(params: ListFiguresParams): string {
  const query = new URLSearchParams();
  if (params.search !== undefined && params.search !== "") query.set("search", params.search);
  if (params.page !== undefined && params.page !== "") query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortDir) query.set("sortDir", params.sortDir);
  if (params.occupation) query.set("occupation", params.occupation);
  if (params.status) query.set("status", params.status);
  if (params.createdBy) query.set("createdBy", params.createdBy);
  const encoded = query.toString();
  return encoded ? `/figures?${encoded}` : "/figures";
}

export async function fetchFiguresStats(token: ApiToken): Promise<FigureStats | null> {
  const data = await apiGet<FigureStats>("/figures/stats", token, "Failed to fetch figure statistics");
  return data ?? null;
}

export async function fetchFiguresList(params: ListFiguresParams, token: ApiToken): Promise<FiguresPage> {
  return apiGet<FiguresPage>(
    buildFiguresQuery({ limit: 10, sortBy: "fullName", sortDir: "ASC", ...params }),
    token,
    "Failed to fetch figures",
  );
}

export async function fetchSingleFigure(token: ApiToken, id: string): Promise<FigureDetail> {
  return apiGet<FigureDetail>(`/figures/${id}`, token, "Failed to fetch figure");
}

export async function createFigure(input: FigureCreateInput, token: ApiToken): Promise<FigureDetail> {
  return apiSend<FigureDetail>("/figures", "POST", input, token, "Failed to create figure");
}

export async function updateFigure(
  id: string,
  input: Partial<FigureCreateInput>,
  token: ApiToken,
): Promise<FigureDetail> {
  return apiSend<FigureDetail>(`/figures/${id}`, "PATCH", input, token, "Failed to update figure");
}

export async function approveFigure(id: string, token: ApiToken): Promise<FigureDetail> {
  return apiSend<FigureDetail>(`/figures/${id}/approve`, "PATCH", {}, token, "Failed to approve figure");
}

export async function rejectFigure(id: string, reason: string, token: ApiToken): Promise<FigureDetail> {
  return apiSend<FigureDetail>(`/figures/${id}/reject`, "PATCH", { reason }, token, "Failed to reject figure");
}

export async function deleteFigure(id: string, token: ApiToken): Promise<void> {
  await apiDelete(`/figures/${id}`, token, "Failed to delete figure");
}

export async function uploadFigureImage(
  file: File,
  token: ApiToken,
  options?: { preferredFormat?: string; quality?: number },
): Promise<FigureSizes> {
  return apiUploadFigureImage(file, token, options);
}
