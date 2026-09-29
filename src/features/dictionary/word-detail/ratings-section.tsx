"use client";

import React from "react";
import { SingleWord } from "../lib";
import { KeyValueParagraph, Stars } from "@/features/shared";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const RatingsSection = ({ data }: { data: SingleWord }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-4 pt-5 pb-5 border-b border-gray-txt-50/20">
      <div className="flex items-center gap-3 max-md:col-span-2">
        <span>{t("common.dictionary.averageRating", "Average Rating:")}</span>

        <Stars rating={data.averageRating ?? 0} />
      </div>
      <KeyValueParagraph item={t("common.dictionary.totalRatings", "Total Ratings")} value={data.totalRatings} />
      <KeyValueParagraph item={t("common.dictionary.totalReviews", "Total Reviews")} value={data.totalReviews} />
    </div>
  );
};

export default RatingsSection;
