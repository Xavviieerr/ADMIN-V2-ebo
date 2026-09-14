"use client";

import { LocaleWrapper } from "@/features/shared";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const SingleContributorCTA = ({ userData }: { userData: any }) => {
  const searchParams = useSearchParams();
  const isContributor = searchParams.get("role") === "contributor";

  if (!isContributor) return null;
  return (
    <div className="flex max-md:flex-col gap-2 items-center self-end lg:self-start">
      {isContributor && (
        <Link
          href={`/users/${userData.id}/application`}
          className="px-5 py-3 bg-white text-secondary-bg  cursor-pointer font-medium text-base rounded-md transition-colors flex items-center gap-2"
        >
          <LocaleWrapper item="common.viewApplication" />
        </Link>
      )}
    </div>
  );
};

export default SingleContributorCTA;
