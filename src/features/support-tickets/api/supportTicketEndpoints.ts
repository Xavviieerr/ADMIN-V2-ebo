import type {
  SupportTicket,
  SupportTicketListResponse,
  GetSupportTicketsParams,
  UpdateSupportTicketStatusParams,
} from "../types";
import type { AppEndpointBuilder } from "@/slice/endpoints/types";

export const supportTicketEndpoints = (builder: AppEndpointBuilder) => ({
  getSupportTickets: builder.query<
    { data: SupportTicketListResponse },
    GetSupportTicketsParams
  >({
    query: ({ page = 1, limit = 8, status, category, sortDir = "DESC" }) => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (status && status !== "all") {
        params.append("status", status);
      }
      if (category && category !== "all") params.append("category", category);
      if (sortDir) params.append("sortDir", sortDir);
      return {
        url: `/support-tickets?${params.toString()}`,
        method: "GET",
      };
    },
    providesTags: ["supportTickets"],
  }),

  getSupportTicketById: builder.query<{ data: SupportTicket }, { id: string }>({
    query({ id }) {
      return {
        url: `/support-tickets/${id}`,
        method: "GET",
      };
    },
    providesTags: (result, error, { id }) =>
      id ? [{ type: "supportTickets", id }] : [],
  }),

  updateSupportTicketStatus: builder.mutation<
    { data: SupportTicket },
    UpdateSupportTicketStatusParams
  >({
    query({ id, status }) {
      return {
        url: `/support-tickets/${id}`,
        method: "PATCH",
        body: { status },
      };
    },
    invalidatesTags: (result, error, { id }) => [
      { type: "supportTickets", id },
      "supportTickets",
    ],
  }),
});
