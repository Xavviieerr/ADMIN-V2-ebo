import type { TicketStatus, TicketCategory } from "./types";

export const SUPPORT_TICKETS_LIST_LIMIT = 8;

export const STATUS_OPTIONS: { value: TicketStatus | "all"; labelKey: string }[] = [
  { value: "all", labelKey: "supportTickets.allStatuses" },
  { value: "open", labelKey: "supportTickets.open" },
  { value: "in_progress", labelKey: "supportTickets.inProgress" },
  { value: "resolved", labelKey: "supportTickets.resolved" },
  { value: "closed", labelKey: "supportTickets.closed" },
];

export const CATEGORY_OPTIONS: { value: TicketCategory | "all"; labelKey: string }[] = [
  { value: "all", labelKey: "supportTickets.allCategories" },
  { value: "feedback", labelKey: "supportTickets.feedback" },
  { value: "bug", labelKey: "supportTickets.bug" },
  { value: "complaint", labelKey: "supportTickets.complaint" },
  { value: "other", labelKey: "supportTickets.other" },
];

export const SORT_DIR_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "DESC", labelKey: "supportTickets.descending" },
  { value: "ASC", labelKey: "supportTickets.ascending" },
];

export const STATUS_COLORS: Record<TicketStatus, string> = {
  open: "text-blue-400",
  in_progress: "text-orange-400",
  resolved: "text-green-400",
  closed: "text-gray-400",
};

export const CATEGORY_COLORS: Record<TicketCategory, string> = {
  feedback: "text-purple-400",
  bug: "text-red-400",
  complaint: "text-yellow-400",
  other: "text-gray-400",
};
