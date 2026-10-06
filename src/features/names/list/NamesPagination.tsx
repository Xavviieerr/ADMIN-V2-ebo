"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

// Range pager ("Showing 1–8 of 52") with a sliding page window.
// URL-driven: page changes push a new query so list state stays shareable
// and survives refresh, like the rest of Names.
const NamesPagination = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const goToPage = useCallback(
    (page: number) => {
      if (!Number.isFinite(page)) return;
      const target = Math.min(Math.max(Math.floor(page), 1), Math.max(totalPages, 1));
      if (target === currentPage) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(target));
      router.push(`/guonopedia/names?${params.toString()}`, { scroll: false });
    },
    [currentPage, router, searchParams, totalPages],
  );

  if (totalPages < 1) return null;

  const start = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);
  const rangeText = t(
    "common.showingRangeOfTotal",
    "Showing {start}–{end} of {total}",
  )
    .replace("{start}", String(start))
    .replace("{end}", String(end))
    .replace("{total}", String(totalItems));

  // Sliding window: always first + last, current ± 1 (extended to a run of
  // 4 at either edge so page 1 of 7 reads 1 2 3 4 … 7), ellipsis on gaps > 1.
  const pages: (number | "start-ellipsis" | "end-ellipsis")[] = [];
  for (let num = 1; num <= totalPages; num++) {
    if (
      num === 1 ||
      num === totalPages ||
      Math.abs(num - currentPage) <= 1 ||
      (currentPage <= 3 && num <= 4) ||
      (currentPage >= totalPages - 2 && num >= totalPages - 3)
    ) {
      pages.push(num);
    } else if (num < currentPage && pages[pages.length - 1] !== "start-ellipsis") {
      pages.push("start-ellipsis");
    } else if (num > currentPage && pages[pages.length - 1] !== "end-ellipsis") {
      pages.push("end-ellipsis");
    }
  }

  const pageButtonClass = (num: number) =>
    `${
      num === currentPage ? "bg-foreground-50 text-base-bg" : ""
    }  w-8 h-8 rounded flex justify-center items-center`;

  return (
    <div className="flex max-md:flex-col-reverse gap-4 w-full max-md:text-sm justify-between md:items-center items-end self-center mt-10 font-header pb-20">
      <p>{rangeText}</p>

      <div className="flex items-center gap-4 font-bold text-plain-gray-800">
        {currentPage !== 1 ? (
          <button onClick={() => goToPage(currentPage - 1)} aria-label={t("names.pager.prev", "Previous page")}>
            <ChevronLeft />
          </button>
        ) : (
          <ChevronLeft className="text-gray-txt-50/50 cursor-default" aria-hidden="true" />
        )}

        {pages.map((entry) =>
          entry === "start-ellipsis" || entry === "end-ellipsis" ? (
            <p key={entry} aria-hidden="true">
              ...
            </p>
          ) : (
            <button
              key={entry}
              onClick={() => goToPage(entry)}
              className="cursor-pointer"
              aria-label={t("names.pager.goTo", "Go to page {num}").replace("{num}", String(entry))}
              aria-current={entry === currentPage ? "page" : undefined}
            >
              <div className={pageButtonClass(entry)}>{entry}</div>
            </button>
          ),
        )}

        {currentPage !== totalPages ? (
          <button onClick={() => goToPage(currentPage + 1)} aria-label={t("names.pager.next", "Next page")}>
            <ChevronRight />
          </button>
        ) : (
          <ChevronRight className="text-gray-text-50/50 cursor-default" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};

export default NamesPagination;
