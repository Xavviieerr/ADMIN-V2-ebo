import React from "react";
import { LocaleWrapper } from "@/features/shared";
import Link from "next/link";
import { Plus } from "lucide-react";

const stats = [
  {
    label: "All Places",
    value: "50",
    caption: "All places indexed on Guono",
  },
  {
    label: "Approved Places",
    value: "32",
    caption: "Total number of approved places",
  },
  {
    label: "Pending Approval",
    value: "18",
    caption: "Total number of pending places",
  },
  {
    label: "Rejected Places",
    value: "2",
    caption: "Total number of rejected places",
  },
];

const FiguresAnalytics = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between w-full gap-4 ">
        <div className="flex flex-col gap-2 text-base">
          <h1 className="text-2xl font-semibold">
            <LocaleWrapper item="common.placesOverview" />
          </h1>
          <p className="text-sm text-gray-500">
            Manage important places on the platform.
          </p>
        </div>

        <Link
          href={"/guonopedia/places/add"}
          className="primary-btn flex items-center gap-3"
        >
          <Plus />
          <LocaleWrapper item="common.addPlace" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map((stat) => (
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

            <span className="text-xs text-gray-txt-50">{stat.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiguresAnalytics;
