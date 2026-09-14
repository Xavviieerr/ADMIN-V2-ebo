import React from "react";
import Link from "next/link";
import DashboardAnalyticsWrapper from "./analytics-wrapper";
import { DashboardStats } from "../types";
import { PermissionGate } from "@/features/shared";
import { getUserStatCards, getDictionaryStatCards } from "../config/analytics";

const DashboardAnalytics = ({
  stats,
}: {
  stats: DashboardStats["stats"] | undefined;
}) => {
  const userStats = getUserStatCards(stats);
  const dictStats = getDictionaryStatCards(stats);

  return (
    <DashboardAnalyticsWrapper>
      <PermissionGate permission="view_user">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4 lg:gap-4">
          {userStats.map((stat) => (
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
      </PermissionGate>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-2 gap-y-4 lg:gap-4">
        {dictStats.map((stat) => (
          <div
            key={stat.label}
            className="w-full gap-3 md:gap-5 rounded-2xl p-5 bg-secondary-bg flex flex-col justify-between"
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
          </div>
        ))}
      </div>
    </DashboardAnalyticsWrapper>
  );
};

export default DashboardAnalytics;
