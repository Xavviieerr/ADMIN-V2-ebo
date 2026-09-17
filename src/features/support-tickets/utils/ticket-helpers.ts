import moment from "moment";
import type { TicketStatus, TicketCategory } from "../types";
import { STATUS_COLORS, CATEGORY_COLORS } from "../constants";

export function getStatusColor(status: TicketStatus): string {
  return STATUS_COLORS[status] ?? "text-gray-400";
}

export function getCategoryColor(category: TicketCategory): string {
  return CATEGORY_COLORS[category] ?? "text-gray-400";
}

export function formatTicketDate(dateString: string): string {
  return moment(dateString).format("DD/MM/YYYY");
}

export function formatTicketDateTime(dateString: string): string {
  return moment(dateString).format("DD/MM/YYYY HH:mm");
}

export function getRelativeTime(dateString: string): string {
  const date = moment(dateString);
  const now = moment();
  const diffMinutes = now.diff(date, "minutes");
  const diffHours = now.diff(date, "hours");
  const diffDays = now.diff(date, "days");

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}
