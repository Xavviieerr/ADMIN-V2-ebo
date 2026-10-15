"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import React from "react";
import { StatusCard } from "@/features/shared";
import type { PlaceListItem } from "../model/types";
import { placeTypeLabel } from "../model/filter-options";
import PlacesMobileCards from "./PlacesMobileCards";
import { useClearFilters } from "./useClearFilters";

// Desktop results table. The toolbar stays mounted even when results fail,
// so this component only ever receives a successful payload.
const PlacesTable: React.FC<{ data: PlaceListItem[] }> = ({ data }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { hasActiveFilter, clearAll } = useClearFilters();

  const items = data ?? [];

  const openDetail = (id: string) => {
    router.push(`/guonopedia/places/${id}`);
  };

  return (
    <>
      <div className="hidden lg:block bg-[#1E1E1E] rounded overflow-hidden w-full">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-txt-100 border-b border-white/10 text-sm sm:text-base font-medium">
              <tr>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("common.name", "Name")}
                </th>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("places.typeLabel", "Type")}
                </th>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("common.location", "Location")}
                </th>
                <th scope="col" className="p-5 text-right font-medium text-white">
                  {t("common.status", "Status")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.length > 0 ? (
                items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => openDetail(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openDetail(item.id);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={t("places.viewDetails", "View details for {name}").replace(
                      "{name}",
                      item.name,
                    )}
                    className="hover:bg-[#2a2a2a]/50 transition-colors capitalize cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  >
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-white font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300 font-medium">
                      {placeTypeLabel(item.type)}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300 font-medium">
                      {[item.location?.city, item.location?.state]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-right font-medium">
                      <StatusCard status={item.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 xl:px-6 py-10 text-center text-sm text-gray-300"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <p>
                        {hasActiveFilter
                          ? t("places.list.emptyFiltered", "No places match your search")
                          : t("places.list.empty", "No places found")}
                      </p>
                      {hasActiveFilter && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearAll();
                          }}
                          className="secondary-btn"
                        >
                          {t("common.clearFilters", "Clear search and filters")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PlacesMobileCards items={items} />
    </>
  );
};

export default PlacesTable;
