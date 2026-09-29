"use client";

import React from "react";
import { LocaleWrapper, PermissionGate } from "@/features/shared";
import Link from "next/link";
import { Plus } from "lucide-react";
import { WordPagination } from "../lib";
import { useSearchParams } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const DictionaryAnalytics = ({
  data,
}: {
  data: WordPagination["statusCounts"];
}) => {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const status = searchParams.get("status") ?? "";
  const handleClick = (v: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");

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
            <LocaleWrapper item="common.entriesOverview" fallback="Entries overview" />
          </h1>
          <p className="text-sm text-gray-500">
            {t(
              "common.dictionary.manageEntries",
              "Manage dictionary entries on the platform.",
            )}
          </p>
        </div>

        <PermissionGate permission="add_word">
          <Link
            href={"/guonopedia/dictionary/add"}
            className="secondary-btn flex items-center gap-3"
          >
            <Plus />
            <p className="max-md:hidden">
              <LocaleWrapper item="common.addWord" fallback="Add Word" />
            </p>
          </Link>
        </PermissionGate>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          {
            statusValue: "approved",
            labelKey: "common.dictionary.approved",
            labelFallback: "Approved",
            value: data?.approved ?? 0,
            captionKey: "common.dictionary.totalApproved",
            captionFallback: "Total number of approved words",
          },
          {
            statusValue: "pending",
            labelKey: "common.dictionary.pending",
            labelFallback: "Pending",
            value: data?.pending ?? 0,
            captionKey: "common.dictionary.totalPending",
            captionFallback: "Total number of pending words",
          },
          {
            statusValue: "in-review",
            labelKey: "common.dictionary.inReview",
            labelFallback: "In-Review",
            value: data?.["in-review"] ?? 0,
            captionKey: "common.dictionary.totalInReview",
            captionFallback: "Total number of words in review",
          },
          {
            statusValue: "rejected",
            labelKey: "common.dictionary.rejected",
            labelFallback: "Rejected",
            value: data?.rejected ?? 0,
            captionKey: "common.dictionary.totalRejected",
            captionFallback: "Total number of rejected words",
          },
        ].map((stat) => (
          <Link
            href={`${handleClick(stat.statusValue)}`}
            key={stat.statusValue}
            className={`w-full md:gap-5 gap-3 rounded-md md:p-5 p-3 bg-secondary-bg flex flex-col justify-between shadow ${
              status === stat.statusValue
                ? "ring-1 ring-foreground-50 "
                : "hover:border border-gray-txt-50"
            } transition-colors duration-300 ease-in`}
          >
            <span className="text-gray-txt-50 max-md:text-sm">
              {t(stat.labelKey, stat.labelFallback)}
            </span>

            <div className="flex justify-between gap-2">
              <span className="md:text-2xl text-lg font-bold text-white">
                {stat.value}
              </span>
            </div>

            <span className="text-xs text-gray-txt-50 max-md:hidden">
              {t(stat.captionKey, stat.captionFallback)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DictionaryAnalytics;
