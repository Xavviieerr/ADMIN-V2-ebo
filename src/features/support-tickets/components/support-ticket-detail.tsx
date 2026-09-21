"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useGetSupportTicketByIdQuery } from "@/slice/requestSlice";
import StatusSelect from "./status-select";
import TicketUserInfo from "./ticket-user-info";
import { formatTicketDateTime } from "../utils/ticket-helpers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface SupportTicketDetailProps {
  ticketId: string;
}

export default function SupportTicketDetail({ ticketId }: SupportTicketDetailProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const router = useRouter();
  const { data, isLoading, isError } = useGetSupportTicketByIdQuery({ id: ticketId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffe6b0] border-t-transparent" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-lg text-gray-400">{t("supportTickets.ticketNotFound")}</p>
        <button
          onClick={() => router.push("/support")}
          className="mt-4 text-sm text-[#ffe6b0] hover:text-[#f5f5f5]"
        >
          {t("supportTickets.backToTickets")}
        </button>
      </div>
    );
  }

  const ticket = data.data;

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
      <button
        onClick={() => router.push("/support")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#f5f5f5] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("supportTickets.backToTickets")}
      </button>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#f5f5f5]">
              {ticket.ticketNumber}
            </h1>
            <p className="text-sm text-gray-400 mt-1 break-words">{ticket.subject}</p>
          </div>
          <div className="shrink-0">
            <StatusSelect ticketId={ticket.id} currentStatus={ticket.status} />
          </div>
        </div>
      </div>

      <TicketUserInfo userId={ticket.userId} />

      <div className="bg-[#1E1E1E] border border-[#23232a] rounded-lg p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-[#f5f5f5] mb-3">
          {t("supportTickets.message")}
        </h3>
        <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
          {ticket.message}
        </p>
      </div>

      <div className="bg-[#1E1E1E] border border-[#23232a] rounded-lg p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-[#f5f5f5] mb-3">
          {t("supportTickets.status")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">{t("supportTickets.createdAt")}</p>
            <p className="text-[#f5f5f5] mt-1">{formatTicketDateTime(ticket.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-400">{t("supportTickets.updatedAt")}</p>
            <p className="text-[#f5f5f5] mt-1">{formatTicketDateTime(ticket.updatedAt)}</p>
          </div>
          {ticket.resolvedAt && (
            <div>
              <p className="text-gray-400">{t("supportTickets.resolvedAt")}</p>
              <p className="text-[#f5f5f5] mt-1">{formatTicketDateTime(ticket.resolvedAt)}</p>
            </div>
          )}
          <div>
            <p className="text-gray-400">{t("supportTickets.category")}</p>
            <p className="text-[#f5f5f5] mt-1 capitalize">
              {t(`supportTickets.${ticket.category}`)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
