export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketCategory = "feedback" | "bug" | "complaint" | "other";
export type TicketSortDir = "ASC" | "DESC";

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketListResponse {
  data: SupportTicket[];
  total: number;
  totalPages: number;
}

export interface GetSupportTicketsParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  sortDir?: TicketSortDir;
}

export interface UpdateSupportTicketStatusParams {
  id: string;
  status: TicketStatus;
}
