import React from "react";
import { LocaleWrapper, PermissionGate } from "@/features/shared";
import Link from "next/link";
import { Plus } from "lucide-react";

import type { FigureStats } from "@/features/figures/model/types";

const STATS = [
  {
    key: "figures.totalFigures",
    fallback: "Total",
    value: (stats: FigureStats | null) => (stats?.count ?? stats?.total ?? 0).toLocaleString(),
    captionKey: "figures.totalFiguresCaption",
    captionFallback: "All figures indexed on the platform",
  },
  {
    key: "common.approved",
    fallback: "Approved",
    value: (stats: FigureStats | null) => (stats?.approved ?? 0).toLocaleString(),
    captionKey: "figures.totalApproved",
    captionFallback: "Total number of approved figures",
  },
  {
    key: "common.dictionary.pending",
    fallback: "Pending",
    value: (stats: FigureStats | null) => (stats?.pending ?? 0).toLocaleString(),
    captionKey: "figures.totalPending",
    captionFallback: "Total number of pending figures",
  },
  {
    key: "common.dictionary.rejected",
    fallback: "Rejected",
    value: (stats: FigureStats | null) => (stats?.rejected ?? 0).toLocaleString(),
    captionKey: "figures.totalRejected",
    captionFallback: "Total number of rejected figures",
  },
] as const;

const FiguresAnalytics = ({ stats }: { stats: FigureStats | null }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start gap-4 w-full">
        <div className="flex flex-col gap-2 text-base">
          <h1 className="text-2xl font-semibold">
            <LocaleWrapper item="figures.overviewTitle" fallback="Figures Overview" />
          </h1>
          <p className="text-sm text-gray-500">
            <LocaleWrapper
              item="figures.manageFigures"
              fallback="Manage important figures on the platform."
            />
          </p>
        </div>

        <PermissionGate permission="create_figure">
          <Link href="/guonopedia/figures/add" className="primary-btn flex items-center gap-2">
            <Plus size={18} />
            <LocaleWrapper item="common.addFigure" fallback="Add Figure" />
          </Link>
        </PermissionGate>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {STATS.map((stat) => (
          <div
            key={stat.key}
            className="w-full gap-5 rounded-2xl p-5 bg-secondary-bg flex flex-col justify-between shadow"
          >
            <span className="text-gray-txt-50">
              <LocaleWrapper item={stat.key} fallback={stat.fallback} />
            </span>

            <div className="flex justify-between gap-2">
              <span className="text-2xl font-bold text-white">{stat.value(stats)}</span>
            </div>

            <span className="text-xs text-gray-txt-50">
              <LocaleWrapper item={stat.captionKey} fallback={stat.captionFallback} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiguresAnalytics;
