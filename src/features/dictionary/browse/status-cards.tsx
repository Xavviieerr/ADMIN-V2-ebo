"use client";

import React from "react";
import { LocaleWrapper, PermissionGate } from "@/features/shared";
import Link from "next/link";
import { Plus } from "lucide-react";
import { WordPagination } from "../lib";
import { useSearchParams } from "next/navigation";

const DictionaryAnalytics = ({
  data,
}: {
  data: WordPagination["statusCounts"];
}) => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const handleClick = (v: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (v === status) {
      currentParams.delete("status");
      const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
      return newPath;
    }

    if (v === "approved") {
      currentParams.set("status", "approved");
    } else if (v === "pending") {
      currentParams.set("status", "pending");
    } else if (v === "in-review") {
      currentParams.set("status", "in-review");
    } else if (v === "rejected") {
      currentParams.set("status", "rejected");
    }

    const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
    return newPath;
  };
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between w-full gap-4 ">
        <div className="flex flex-col gap-2 text-base">
          <h1 className="text-2xl font-semibold">
            <LocaleWrapper item="common.entriesOverview" />
          </h1>
          <p className="text-sm text-gray-500">
            Manage dictionary entries on the platform.
          </p>
        </div>

        <PermissionGate permission="add_word">
          <Link
            href={"/guonopedia/dictionary/add"}
            className="secondary-btn flex items-center gap-3"
          >
            <Plus />
            <p className="max-md:hidden">
              <LocaleWrapper item="common.addWord" />
            </p>
          </Link>
        </PermissionGate>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          {
            label: "Approved",
            value: data.approved,
            caption: "Total number of approved words",
          },
          {
            label: "Pending",
            value: data.pending,
            caption: "Total number of pending words",
          },
          {
            label: "In-Review",
            value: data["in-review"],
            caption: "Total number of words in review",
          },
          {
            label: "Rejected",
            value: data.rejected,
            caption: "Total number of rejected words",
          },
        ].map((stat) => (
          <Link
            href={`${handleClick(stat.label.toLowerCase())}`}
            key={stat.label}
            className={`w-full md:gap-5 gap-3 rounded-md md:p-5 p-3 bg-secondary-bg flex flex-col justify-between shadow ${
              status === stat.label.toLowerCase()
                ? "ring-1 ring-foreground-50 "
                : "hover:border border-gray-txt-50"
            } transition-colors duration-300 ease-in`}
          >
            <span className="text-gray-txt-50 max-md:text-sm">
              {stat.label}
            </span>

            <div className="flex justify-between gap-2">
              <span className="md:text-2xl text-lg font-bold text-white">
                {stat.value}
              </span>
            </div>

            <span className="text-xs text-gray-txt-50 max-md:hidden">
              {stat.caption}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DictionaryAnalytics;
