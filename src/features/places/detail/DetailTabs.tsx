"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

export type DetailTab = "overview" | "related" | "reviews" | "claims";

// Tab bar for the detail workspace. Tab state lives in ?tab= so it survives
// refresh and is shareable. Reviews/claims tabs only render with a profile.
const DetailTabs = ({
  active,
  placeId,
  hasProfile,
}: {
  active: DetailTab;
  placeId: string;
  hasProfile: boolean;
}) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const tabs: { value: DetailTab; label: string; disabled?: boolean }[] = [
    { value: "overview", label: t("places.detail.tabOverview", "Overview") },
    { value: "related", label: t("places.detail.tabRelated", "Related") },
    { value: "reviews", label: t("places.detail.tabReviews", "Reviews"), disabled: !hasProfile },
    { value: "claims", label: t("places.detail.tabClaims", "Claims"), disabled: !hasProfile },
  ];

  const goTo = (value: DetailTab) => {
    router.replace(`/guonopedia/places/${placeId}?tab=${value}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 w-full overflow-x-auto custom-scrollbar" role="tablist" aria-label="Place detail sections">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          disabled={tab.disabled}
          onClick={() => goTo(tab.value)}
          title={tab.disabled ? t("places.detail.noProfileForTab", "Available when a business profile exists") : undefined}
          className={`rounded px-6 sm:px-10 py-2.5 whitespace-nowrap transition-all duration-300 ease-in-out ${
            active === tab.value
              ? "primary-btn font-medium"
              : "border border-gray-txt-100 hover:border-gray-txt-50 hover:font-medium"
          } ${tab.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default DetailTabs;
