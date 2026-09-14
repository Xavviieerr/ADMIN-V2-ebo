import React from "react";
import { LocaleWrapper } from "@/features/shared";
import Link from "next/link";

type NamesStats = {
  count: number;
  approved: number;
  pending: number;
  nicknames: number;
  givenNames: number;
  surnames: number;
}

const NamesAnalytics = ({ stats }: { stats: NamesStats }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between w-full gap-4 ">
        <div className="flex flex-col gap-2 text-base">
          <h1 className="text-2xl font-semibold">
            <LocaleWrapper item="common.namesOverview" />
          </h1>
          <p className="text-sm text-gray-500">
            Manage Urhobo names on the platform.
          </p>
        </div>

        <Link href="/guonopedia/names/add" className="primary-btn ">
          <LocaleWrapper item={"common.addName"} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          {
            label: "All Names",
            value: stats.count?.toLocaleString() || "0",
            caption: "All indexed names on Guono",
          },
          {
            label: "First Names",
            value: stats.givenNames?.toLocaleString() || "0",
            caption: "First names indexed on Guono",
          },
          {
            label: "Last Names",
            value: stats.surnames?.toLocaleString() || "0",
            caption: "Last names indexed on Guono",
          },
          {
            label: "Pending Approval",
            value: stats.pending?.toLocaleString() || "0",
            caption: "Names pending approval",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="w-full gap-5 rounded-2xl p-5 bg-secondary-bg flex flex-col justify-between shadow"
          >
            <span className="text-gray-txt-50">{stat.label}</span>

            <div className="flex justify-between gap-2">
              <span className="text-2xl font-bold text-white">
                {stat.value}
              </span>
            </div>

            <span className="text-xs text-gray-txt-50 max-md:hidden">{stat.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NamesAnalytics;
