import type { Contributor, ContributorStats, ContributorListResponse } from "@/features/users/types";
import type { AppEndpointBuilder } from "./types";

export const contributorEndpoints = (builder: AppEndpointBuilder) => ({
  getContributors: builder.query<
    { data: ContributorListResponse },
    {
      page?: number;
      limit?: number;
      sortBy?: string;
      status?: string;
      sortDir?: string;
    }
  >({
    query: ({ page = 1, limit = 10, sortBy, status, sortDir }) => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (sortBy) params.append("sortBy", sortBy);
      if (status && status !== "all") params.append("status", status);
      if (sortDir) params.append("sortDir", sortDir);
      return {
        url: `/contributors?${params.toString()}`,
        method: "GET",
      };
    },
    providesTags: ["contributors"],
  }),

  getContributorStats: builder.query<{ data: ContributorStats }, void>({
    query() {
      return {
        url: "/contributors/stats",
        method: "GET",
      };
    },
    providesTags: ["contributors"],
  }),

  getContributorById: builder.query<{ data: Contributor }, { contributorId: string }>({
    query({ contributorId }) {
      return {
        url: `/contributors/${contributorId}`,
        method: "GET",
      };
    },
    providesTags: (result, error, { contributorId }) =>
      contributorId ? [{ type: "contributors", id: contributorId }] : [],
  }),

  approveContributor: builder.mutation<
    { data: Contributor },
    { contributorId: string }
  >({
    query({ contributorId }) {
      return {
        url: `/contributors/${contributorId}/approve`,
        method: "PATCH",
      };
    },
    invalidatesTags: (result, error, { contributorId }) => [
      { type: "contributors", id: contributorId },
      "contributors",
    ],
  }),

  rejectContributor: builder.mutation<
    { data: Contributor },
    { contributorId: string; reason: string }
  >({
    query({ contributorId, reason }) {
      return {
        url: `/contributors/${contributorId}/reject`,
        method: "PATCH",
        body: { reason },
      };
    },
    invalidatesTags: (result, error, { contributorId }) => [
      { type: "contributors", id: contributorId },
      "contributors",
    ],
  }),

  suspendContributor: builder.mutation<
    { data: Contributor },
    { contributorId: string; reason: string }
  >({
    query({ contributorId, reason }) {
      return {
        url: `/contributors/${contributorId}/suspend`,
        method: "PATCH",
        body: { reason },
      };
    },
    invalidatesTags: (result, error, { contributorId }) => [
      { type: "contributors", id: contributorId },
      "contributors",
    ],
  }),
});
