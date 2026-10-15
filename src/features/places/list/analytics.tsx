import React from "react";
import { LocaleWrapper, PermissionGate } from "@/features/shared";
import Link from "next/link";
import { Plus } from "lucide-react";

import type { PlaceStats } from "@/features/places/model/types";

const STATS = [
  {
    key: "places.totalPlaces",
    fallback: "Total Places",
    value: (stats: PlaceStats | null) => stats?.total?.toLocaleString() || "0",
    captionKey: "places.totalPlacesCaption",
    captionFallback: "All places indexed on the platform",
  },
  {
    key: "common.approved",
    fallback: "Approved",
    value: (stats: PlaceStats | null) => stats?.approved?.toLocaleString() || "0",
    captionKey: "places.totalApproved",
    captionFallback: "Total number of approved places",
  },
  {
    key: "common.dictionary.pending",
    fallback: "Pending Approval",
    value: (stats: PlaceStats | null) => stats?.pending?.toLocaleString() || "0",
    captionKey: "places.totalPending",
    captionFallback: "Total number of pending places",
  },
  {
    key: "common.dictionary.rejected",
    fallback: "Rejected",
    value: (stats: PlaceStats | null) => stats?.rejected?.toLocaleString() || "0",
    captionKey: "places.totalRejected",
    captionFallback: "Total number of rejected places",
  },
  {
    key: "places.totalBusinesses",
    fallback: "Businesses",
    value: (stats: PlaceStats | null) => stats?.businesses?.toLocaleString() || "0",
    captionKey: "places.totalBusinessesCaption",
    captionFallback: "Places with business profiles",
  },
  {
    key: "places.totalClaimed",
    fallback: "Claimed",
    value: (stats: PlaceStats | null) => stats?.claimed?.toLocaleString() || "0",
    captionKey: "places.totalClaimedCaption",
    captionFallback: "Business profiles under ownership",
  },
] as const;

const PlacesAnalytics = ({ stats }: { stats: PlaceStats | null }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start gap-4 w-full">
        <div className="flex flex-col gap-2 text-base">
          <h1 className="text-2xl font-semibold">
            <LocaleWrapper item="places.overviewTitle" fallback="Places Overview" />
          </h1>
          <p className="text-sm text-gray-500">
            <LocaleWrapper
              item="places.managePlaces"
              fallback="Manage important places on the platform."
            />
          </p>
        </div>

        <PermissionGate permission="create_place">
          <Link href="/guonopedia/places/add" className="primary-btn flex items-center gap-2">
            <Plus size={18} />
            <LocaleWrapper item="common.addPlace" fallback="Add Place" />
          </Link>
        </PermissionGate>
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

            <span className="text-xs text-gray-txt-50">
              <LocaleWrapper item={stat.captionKey} fallback={stat.captionFallback} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesAnalytics;
