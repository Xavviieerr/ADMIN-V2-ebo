"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import React from "react";
import type { NameRecord } from "../model/types";
import { NameStatusBadge } from "../shared/NameStatusBadge";
import NamesMobileCards from "./NamesMobileCards";
import { useClearFilters } from "./useClearFilters";

// Desktop results table. The toolbar (search + filters) lives in
// NamesToolbar and stays mounted even when results fail, so this component
// only ever receives a successful payload.
const NamesTable: React.FC<{ data: NameRecord }> = ({ data }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { hasActiveFilter, clearAll } = useClearFilters();

  const items = data.items ?? [];

  const openDetail = (id: string) => {
    router.push(`/guonopedia/names/${id}`);
  };

  return (
    <>
      <div className="hidden lg:block bg-[#1E1E1E] rounded overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-txt-100 border-b border-white/10 text-sm sm:text-base font-medium">
              <tr>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("common.name")}
                </th>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("common.type")}
                </th>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("common.gender")}
                </th>
                <th scope="col" className="p-5 text-right font-medium text-white">
                  {t("common.status")}
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
                    aria-label={t("names.detail.viewDetails", "View details for {name}").replace("{name}", item.name)}
                    className="hover:bg-[#2a2a2a]/50 transition-colors capitalize cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  >
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-white font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300 font-medium normal-case">
                      {item.nameType}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300 font-medium capitalize">
                      {item.gender}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-right font-medium">
                      <NameStatusBadge status={item.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-gray-400">
                        {hasActiveFilter
                          ? t("names.list.emptyFiltered", "No names match your search")
                          : t("names.list.empty", "No names found")}
                      </p>
                      {hasActiveFilter && (
                        <button type="button" onClick={clearAll} className="secondary-btn">
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

      <NamesMobileCards items={items} />
    </>
  );
};

export default NamesTable;
