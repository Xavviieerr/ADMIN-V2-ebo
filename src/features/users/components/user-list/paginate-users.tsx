import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getPageNumbers } from "../../utils/listHelpers";

const UsersPagination = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  showText = true,
  handlePrev,
  handleNext,
  jumpToPage,
}: {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  limit?: number;
  showText?: boolean;
  handlePrev: () => void;
  handleNext: () => void;
  jumpToPage: (page: number) => void;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const pages = getPageNumbers(currentPage, totalPages);
  const startItem = totalItems && limit ? (currentPage - 1) * limit + 1 : null;
  const endItem =
    totalItems && limit ? Math.min(currentPage * limit, totalItems) : null;

  return (
    <div className="flex max-md:flex-col-reverse gap-4 w-full max-md:text-sm justify-between md:items-center items-end mt-10 font-header pb-20">
      {showText && startItem && endItem && totalItems ? (
        <p className="text-sm text-gray-400">
          {t("common.showingRangeOfTotal", "Showing {start}–{end} of {total}")
            .replace("{start}", String(startItem))
            .replace("{end}", String(endItem))
            .replace("{total}", String(totalItems))}
        </p>
      ) : showText ? (
        <p className="text-sm text-gray-400">
          {t("common.pageOf", "Page {current} of {total}")
            .replace("{current}", String(currentPage))
            .replace("{total}", String(totalPages))}
        </p>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-1 font-bold text-plain-gray-800">
        <button
          onClick={handlePrev}
          disabled={currentPage <= 1}
          aria-label={t("common.previousPage", "Previous page")}
          className="p-1 rounded hover:bg-white/10 disabled:opacity-40 disabled:cursor-default transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {pages.map((page, i) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => jumpToPage(page)}
              className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-colors ${
                page === currentPage
                  ? "bg-foreground-50 text-base-bg"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          aria-label={t("common.nextPage", "Next page")}
          className="p-1 rounded hover:bg-white/10 disabled:opacity-40 disabled:cursor-default transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default UsersPagination;
