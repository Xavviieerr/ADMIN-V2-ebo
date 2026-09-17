"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getStatusColor, getCategoryColor, formatTicketDate } from "../utils/ticket-helpers";
import type { SupportTicket } from "../types";
import { useRouter } from "next/navigation";

interface SupportTicketCardsProps {
  tickets: SupportTicket[];
}

export default function SupportTicketCards({ tickets }: SupportTicketCardsProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const router = useRouter();

  const handleCardClick = (ticketId: string) => {
    router.push(`/support/${ticketId}`);
  };

  return (
    <div className="lg:hidden space-y-3">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick(ticket.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick(ticket.id);
            }
          }}
          className="bg-[#1E1E1E] rounded-lg border border-white/10 p-4 space-y-3 cursor-pointer hover:bg-[#2a2a2a]/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#ffe6b0]">{ticket.ticketNumber}</span>
            <span className={`text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
              {t(`supportTickets.${ticket.status === "in_progress" ? "inProgress" : ticket.status}`)}
            </span>
          </div>

          <p className="text-sm font-medium text-[#f5f5f5] truncate">{ticket.subject}</p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className={`font-medium capitalize ${getCategoryColor(ticket.category)}`}>
              {t(`supportTickets.${ticket.category}`)}
            </span>
            <span>{formatTicketDate(ticket.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
