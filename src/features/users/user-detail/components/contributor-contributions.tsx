"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import type { Contributor } from "../../types";

type ContributionStatus = "all" | "approved" | "pending" | "rejected";

const ContributorContributions = ({
  contributor,
}: {
  contributor: Contributor;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [statusFilter, setStatusFilter] = useState<ContributionStatus>("all");

  const statusFilters: { value: ContributionStatus; label: string }[] = [
    { value: "all", label: t("common.all", "All") },
    { value: "approved", label: t("common.approved", "Approved") },
    { value: "pending", label: t("common.pending", "Pending") },
    { value: "rejected", label: t("common.rejected", "Rejected") },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          {t("common.contributions", "Contributions")}
        </h2>
        <div className="flex items-center gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === filter.value
                  ? "primary-btn"
                  : "border border-gray-txt-100 hover:border-gray-txt-50 text-gray-txt-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-txt-100 border-b border-white/10 text-sm font-medium">
              <tr>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("common.title", "Title")}
                </th>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("common.type", "Type")}
                </th>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("common.status")}
                </th>
                <th scope="col" className="p-5 text-left font-medium text-white">
                  {t("common.submittedDate", "Submitted Date")}
                </th>
                <th scope="col" className="p-5 text-center font-medium text-white">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {contributor.submissionCount === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    {t(
                      "common.noContributionsYet",
                      "No contributions yet. Contributions will appear here once this contributor starts submitting content.",
                    )}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    {t(
                      "common.contributionsComingSoon",
                      "Contribution management will be available soon. Contributions endpoint coming soon.",
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContributorContributions;
