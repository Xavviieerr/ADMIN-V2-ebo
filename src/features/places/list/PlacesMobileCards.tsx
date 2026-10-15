"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import Link from "next/link";
import React from "react";
import { StatusCard } from "@/features/shared";
import type { PlaceListItem } from "../model/types";
import { placeTypeLabel } from "../model/filter-options";
import { useClearFilters } from "./useClearFilters";

// Mobile cards (mirrors the desktop table content).
const PlacesMobileCards: React.FC<{ items: PlaceListItem[] }> = ({ items }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { hasActiveFilter, clearAll } = useClearFilters();

  return (
    <>
      {items.length === 0 && (
        <div className="lg:hidden text-center w-full mt-10 pb-6 flex flex-col items-center gap-3">
          <p>
            {hasActiveFilter
              ? t("places.list.emptyFiltered", "No places match your search")
              : t("places.list.empty", "No places found")}
          </p>
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
            href={`/guonopedia/places/${item.id}`}
            className="lg:hidden bg-[#1E1E1E] rounded-lg border border-white/10 p-4 space-y-3 hover:bg-[#2a2a2a]/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-medium text-white truncate capitalize">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  {placeTypeLabel(item.type)}
                </p>
              </div>
              <StatusCard status={item.status} />
            </div>
            <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {t("common.location", "Location")}:
                </span>
                <span className="text-xs sm:text-sm text-gray-300">
                  {[item.location?.city, item.location?.state]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default PlacesMobileCards;
