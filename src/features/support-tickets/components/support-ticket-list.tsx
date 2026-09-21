"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useSupportTicketsList } from "../hooks";
import SupportTicketFilters from "./support-ticket-filters";
import SupportTicketTable from "./support-ticket-table";
import SupportTicketCards from "./support-ticket-cards";
import UsersPagination from "@/features/users/components/user-list/paginate-users";
import { SUPPORT_TICKETS_LIST_LIMIT } from "../constants";
import { Button } from "@/components/ui/button";
import { LifeBuoy } from "lucide-react";

export default function SupportTicketList() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const {
    tickets,
    total,
    totalPages,
    page,
    status,
    category,
    sortDir,
    isLoading,
    isError,
    refetch,
    handleStatusChange,
    handleCategoryChange,
    handleSortDirChange,
    handlePageChange,
    handlePrev,
    handleNext,
  } = useSupportTicketsList();

  return (
    <div className="space-y-4 sm:space-y-6 px-4 md:px-6 lg:px-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#f5f5f5]">
          {t("supportTickets.title")}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {t("supportTickets.subtitle")}
        </p>
      </div>

      <SupportTicketFilters
        status={status}
        category={category}
        sortDir={sortDir}
        onStatusChange={handleStatusChange}
        onCategoryChange={handleCategoryChange}
        onSortDirChange={handleSortDirChange}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffe6b0] border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-lg text-red-400">Error loading tickets</p>
          <Button
            variant="ghost"
            className="mt-4 text-[#ffe6b0] hover:text-[#f5f5f5]"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <LifeBuoy className="h-12 w-12 text-gray-600 mb-4" />
          <p className="text-lg text-gray-400">
            {status !== "all" || category !== "all"
              ? t("supportTickets.noResults")
              : t("supportTickets.noTickets")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {status !== "all" || category !== "all"
              ? t("supportTickets.noResultsDesc")
              : t("supportTickets.noTicketsDesc")}
          </p>
        </div>
      ) : (
        <>
          <SupportTicketTable tickets={tickets} />
          <SupportTicketCards tickets={tickets} />
          <UsersPagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            limit={SUPPORT_TICKETS_LIST_LIMIT}
            handlePrev={handlePrev}
            handleNext={handleNext}
            jumpToPage={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
