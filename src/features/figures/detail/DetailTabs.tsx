"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

export type FigureDetailTab = "overview" | "biography" | "family" | "links";

const FigureDetailTabs = ({
  active,
  figureId,
}: {
  active: FigureDetailTab;
  figureId: string;
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const tabs: { value: FigureDetailTab; label: string }[] = [
    { value: "overview", label: t("figures.detail.tabOverview", "Overview") },
    { value: "biography", label: t("figures.detail.tabBiography", "Biography") },
    { value: "family", label: t("figures.detail.tabFamily", "Family") },
    { value: "links", label: t("figures.detail.tabLinks", "Links") },
  ];

  const goTo = (value: FigureDetailTab) => {
    router.replace(`/guonopedia/figures/${figureId}?tab=${value}`, { scroll: false });
  };

  return (
    <div
      className="flex items-center gap-2 w-full overflow-x-auto custom-scrollbar"
      role="tablist"
      aria-label="Figure detail sections"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          onClick={() => goTo(tab.value)}
          className={`rounded px-6 sm:px-10 py-2.5 whitespace-nowrap transition-all duration-300 ease-in-out ${
            active === tab.value
              ? "primary-btn font-medium"
              : "border border-gray-txt-100 hover:border-gray-txt-50 hover:font-medium"
          } cursor-pointer`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FigureDetailTabs;
