"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import React from "react";
import type { NameListItem } from "../model/types";
import { NameStatusBadge } from "../shared/NameStatusBadge";
import { useClearFilters } from "./useClearFilters";

// Mobile cards (mirrors the users MobileUserCards separation).
const NamesMobileCards: React.FC<{ items: NameListItem[] }> = ({ items }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { hasActiveFilter, clearAll } = useClearFilters();

  return (
    <>
      {items.length === 0 && (
        <div className="lg:hidden text-center w-full mt-10 pb-6 flex flex-col items-center gap-3">
          <p>{hasActiveFilter
            ? t("names.list.emptyFiltered", "No names match your search")
            : t("names.list.empty", "No names found")}</p>
          {hasActiveFilter && (
            <button type="button" onClick={clearAll} className="secondary-btn">
              {t("common.clearFilters", "Clear search and filters")}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/guonopedia/names/${item.id}`}
            className="lg:hidden bg-[#1E1E1E] rounded-lg border border-white/10 p-4 space-y-3 hover:bg-[#2a2a2a]/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-medium text-white truncate capitalize">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  {item.nameType}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {t("common.gender", "Gender")}:
                </span>
                <span className="text-xs sm:text-sm text-gray-300 capitalize">
                  {item.gender}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {t("common.statusLabel")}
                </span>
                <NameStatusBadge status={item.status} className="text-xs sm:text-sm font-medium" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default NamesMobileCards;
