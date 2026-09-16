"use client";

import { LocaleWrapper } from "@/features/shared";
import type { UserData, Contributor } from "../types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import UserProfile from "./components/user-profile";
import ContributorContributions from "./components/contributor-contributions";

type TabValue = "profile" | "contributions";

const ContributorBody = ({
  data,
  contributor,
  isContributorView,
}: {
  data: UserData;
  contributor?: Contributor;
  isContributorView?: boolean;
}) => {
  const [page, setPage] = React.useState<TabValue>("profile");
  const searchParams = useSearchParams();

  const showContributions = contributor?.status === "approved";

  const tabs = useMemo(
    () => [
      { label: "sidebar.profile", value: "profile" as TabValue },
      ...(showContributions
        ? [{ label: "common.contributions", value: "contributions" as TabValue }]
        : []),
    ],
    [showContributions],
  );

  useEffect(() => {
    const view = searchParams.get("v");
    if (view && tabs.some((t) => t.value === view)) {
      setPage(view as TabValue);
    }
  }, [searchParams, tabs]);

  if (!isContributorView) return null;

  return (
    <div className="w-full pb-20">
      {tabs.length > 1 && (
        <div className="flex items-center w-full md:w-1/2 my-5">
          {tabs.map((item: { label: string; value: string }) => (
            <button
              key={item.value}
              onClick={() => setPage(item.value as TabValue)}
              className={`${page === item.value ? "primary-btn font-medium" : "border border-gray-txt-100 hover:border-gray-txt-50 hover:font-medium transition-all duration-300 ease-in-out"} rounded  px-10 py-3 w-full`}
            >
              <LocaleWrapper item={item.label} />
            </button>
          ))}
        </div>
      )}
      {page === "profile" && (
        <UserProfile userData={data} contributor={contributor} />
      )}
      {page === "contributions" && contributor && (
        <ContributorContributions contributor={contributor} />
      )}
    </div>
  );
};

export default ContributorBody;
