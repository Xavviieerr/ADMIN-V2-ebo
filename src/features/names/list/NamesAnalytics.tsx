import React from "react";
import { LocaleWrapper } from "@/features/shared";
import Link from "next/link";

import type { NamesStats } from "@/features/names/model/types";

const STATS = [
  {
    key: "names.analytics.allNames",
    fallback: "All Names",
    value: (stats: NamesStats | null) => stats?.count?.toLocaleString() || "0",
    captionKey: "names.analytics.allCaption",
    captionFallback: "All indexed names on Guono",
  },
  {
    key: "names.analytics.givenLabel",
    fallback: "given name",
    value: (stats: NamesStats | null) => stats?.givenNames?.toLocaleString() || "0",
    captionKey: "names.analytics.firstCaption",
    captionFallback: "given name entries on Guono",
  },
  {
    key: "names.analytics.surnameLabel",
    fallback: "surname",
    value: (stats: NamesStats | null) => stats?.surnames?.toLocaleString() || "0",
    captionKey: "names.analytics.lastCaption",
    captionFallback: "surname entries on Guono",
  },
  {
    key: "names.analytics.nicknameLabel",
    fallback: "nickname",
    value: (stats: NamesStats | null) => stats?.nicknames?.toLocaleString() || "0",
    captionKey: "names.analytics.nicknamesCaption",
    captionFallback: "Nicknames indexed on Guono",
  },
  {
    key: "common.approved",
    fallback: "Approved",
    value: (stats: NamesStats | null) => stats?.approved?.toLocaleString() || "0",
    captionKey: "names.analytics.approvedCaption",
    captionFallback: "Approved names on Guono",
  },
  {
    key: "names.analytics.pendingLabel",
    fallback: "Pending Approval",
    value: (stats: NamesStats | null) => stats?.pending?.toLocaleString() || "0",
    captionKey: "names.analytics.pendingCaption",
    captionFallback: "Names pending approval",
  },
] as const;

const NamesAnalytics = ({ stats }: { stats: NamesStats | null }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start gap-4 w-full">
        <div className="flex flex-col gap-2 text-base">
          <h1 className="text-2xl font-semibold">
            <LocaleWrapper item="common.namesOverview" />
          </h1>
          <p className="text-sm text-gray-500">
            <LocaleWrapper
              item="names.list.subtitle"
              fallback="Manage Urhobo names on the platform."
            />
          </p>
        </div>

        <Link href="/guonopedia/names/add" className="primary-btn ">
          <LocaleWrapper item={"common.addName"} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {STATS.map((stat) => (
          <div
            key={stat.key}
            className="w-full gap-5 rounded-2xl p-5 bg-secondary-bg flex flex-col justify-between shadow"
          >
            <span className="text-gray-txt-50">
              <LocaleWrapper item={stat.key} fallback={stat.fallback} />
            </span>

            <div className="flex justify-between gap-2">
              <span className="text-2xl font-bold text-white">
                {stat.value(stats)}
              </span>
            </div>

            <span className="text-xs text-gray-txt-50 max-md:hidden">
              <LocaleWrapper item={stat.captionKey} fallback={stat.captionFallback} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NamesAnalytics;
