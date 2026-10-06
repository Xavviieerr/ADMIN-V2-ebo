// Ownership for province/dialect lookups used by the Names create/edit forms.
// Single owner (replaces the duplicated fetch-dialects copies).

import { apiGet, type ApiToken } from "./request";

export type Dialect = {
  id: string;
  name: string;
};

export async function fetchDialects(
  token: ApiToken,
  params: { page?: number; limit?: number } = { page: 1, limit: 50 },
): Promise<Dialect[]> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 50),
  });
  return apiGet<Dialect[]>(`/provinces/all?${query.toString()}`, token, "Failed to fetch dialects");
}
