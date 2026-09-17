"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface NotificationPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function NotificationPagination({
  currentPage,
  totalPages,
  onPageChange,
}: NotificationPaginationProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (showEllipsisStart) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (showEllipsisEnd) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label={t("pagination.first")}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t("pagination.previous")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((pageNum, index) =>
        pageNum === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-gray-500"
          >
            ...
          </span>
        ) : (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "ghost"}
            size="icon"
            className={`h-9 w-9 ${
              currentPage === pageNum
                ? "bg-[#ffe6b0] text-[#1e1e1e] hover:bg-[#ffe6b0]/90"
                : ""
            }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t("pagination.next")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label={t("pagination.last")}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
