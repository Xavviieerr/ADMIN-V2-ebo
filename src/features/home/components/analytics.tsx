"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HomeStats } from "../types";
import { getStatCards } from "../config/analytics";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

const HomeAnalytics = ({
  stats,
}: {
  stats: HomeStats["stats"] | undefined;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [hidden, setHidden] = useState(false);
  const statCards = getStatCards(stats, t);

  return (
    <section className="w-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-between max-md:pb-3 max-md:border-b border-gray-txt-50/20">
        <h2 className="text-2xl font-semibold text-white">{t("home.overview")}</h2>

        <button
          className="secondary-btn cursor-pointer md:hidden"
          onClick={() => setHidden((prev) => !prev)}
          aria-expanded={!hidden}
        >
          {hidden ? t("common.view") : t("common.hide")} {t("common.statistics")}
        </button>
      </div>

      {!hidden && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4 lg:gap-4">
          {statCards.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="w-full gap-3 md:gap-5 rounded-2xl p-5 bg-secondary-bg flex flex-col justify-between cursor-pointer border hover:border-gray-txt-50 border-secondary-bg transition-all duration-300"
            >
              <span className="text-gray-txt-50">{stat.label}</span>
              <div className="flex justify-between gap-2">
                <span className="text-2xl font-bold text-white">
                  {stat.value}
                </span>
              </div>
              <span className="text-xs text-gray-txt-50 max-md:hidden">
                {stat.caption}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeAnalytics;
