"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getStatusColor, getCategoryColor, formatTicketDate } from "../utils/ticket-helpers";
import type { SupportTicket } from "../types";
import { useRouter } from "next/navigation";

interface SupportTicketTableProps {
  tickets: SupportTicket[];
}

export default function SupportTicketTable({ tickets }: SupportTicketTableProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const router = useRouter();

  const handleRowClick = (ticketId: string) => {
    router.push(`/support/${ticketId}`);
  };

  return (
    <div className="hidden lg:block">
      <table className="w-full min-w-[640px]">
        <caption className="sr-only">{t("supportTickets.title")}</caption>
        <thead className="bg-[#1E1E1E] border-b border-white/10">
          <tr>
            <th scope="col" className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">
              {t("supportTickets.ticketNumber")}
            </th>
            <th scope="col" className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">
              {t("supportTickets.user")}
            </th>
            <th scope="col" className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">
              {t("supportTickets.category")}
            </th>
            <th scope="col" className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">
              {t("supportTickets.subject")}
            </th>
            <th scope="col" className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">
              {t("supportTickets.status")}
            </th>
            <th scope="col" className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">
              {t("supportTickets.createdAt")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              tabIndex={0}
              onClick={() => handleRowClick(ticket.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRowClick(ticket.id);
                }
              }}
              className="cursor-pointer hover:bg-[#23232a]/50 transition-colors"
            >
              <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-[#ffe6b0] font-mono">
                {ticket.ticketNumber}
              </td>
              <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300">
                {ticket.userId.slice(0, 8)}...
              </td>
              <td className="px-4 xl:px-6 py-3 xl:py-4">
                <span className={`text-xs font-medium capitalize ${getCategoryColor(ticket.category)}`}>
                  {t(`supportTickets.${ticket.category}`)}
                </span>
              </td>
              <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-[#f5f5f5] max-w-[200px] truncate">
                {ticket.subject}
              </td>
              <td className="px-4 xl:px-6 py-3 xl:py-4">
                <span className={`text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                  {t(`supportTickets.${ticket.status === "in_progress" ? "inProgress" : ticket.status}`)}
                </span>
              </td>
              <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-400">
                {formatTicketDate(ticket.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
