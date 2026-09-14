"use client";

import { LocaleWrapper, UserData } from "@/features/shared";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import ContributorProfile from "./components/contributor-profile";
import ContributorPermissions from "./components/contributor-permissions";

const ContributorBody = ({ data }: { data: UserData }) => {
  const [page, setPage] = React.useState<"profile" | "permission">("profile");
  const searchParams = useSearchParams();

  const isContributor = searchParams.get("role") === "contributor";

  if (!isContributor) return null;

  useEffect(() => {
    const view = searchParams.get("v");
    if (view && ["profile", "permission"].includes(view)) {
      setPage(view as "profile" | "permission");
    }
  }, [searchParams]);

  return (
    <div className="w-full pb-20">
      <div className="flex items-center w-1/2 my-5">
        {[
          { label: "sidebar.profile", value: "profile" },
          { label: "sidebar.permissions", value: "permission" },
        ].map((item: { label: string; value: string }) => (
          <button
            key={item.value}
            onClick={() => setPage(item.value as any)}
            className={`${page === item.value ? "primary-btn font-medium" : "border border-gray-txt-100 hover:border-gray-txt-50 hover:font-medium transition-all duration-300 ease-in-out"} rounded  px-10 py-3 w-full`}
          >
            <LocaleWrapper item={item.label} />
          </button>
        ))}
      </div>
      {page == "profile" && <ContributorProfile data={data} />}
      {page == "permission" && <ContributorPermissions userId={data.id} />}
    </div>
  );
};

export default ContributorBody;
