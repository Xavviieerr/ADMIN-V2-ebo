"use client";

import React, { useEffect, useState } from "react";
import { ToggleButton, UserStatus } from "@/features/shared";
import type { UserData } from "../../types";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import moment from "moment";
import { useRouter } from "next/navigation";

const ContributorProfile = ({ data }: { data: UserData }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const personalInfo = [
    { label: "username", value: data?.username },
    { label: "email", value: data?.email },
    {
      label: "email verified",
      value: data?.isEmailVerified ? t("common.yes", "Yes") : t("common.no", "No"),
    },
    { label: "role", value: "Contributor" },
    { label: "status", value: data?.status },
    {
      label: "joined date",
      value: moment(data?.createdAt).format("DD/MM/YYYY"),
    },
    {
      label: "last login",
      value: moment(data?.activityStats?.lastLogin).fromNow(),
    },
    {
      label: "total logins",
      value: data?.activityStats?.totalLogins,
    },
    {
      label: "active days",
      value: data?.activityStats?.totalActiveDays,
    },
    {
      label: t("common.giveContributorAccess", "give contributor access"),
      value: "contributor",
    },
  ];
  const [isContributor, setIsContributor] = useState(true);
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      if (isContributor) {
        router.replace(`/users/${data.id}?role=contributor`);
      } else {
        router.replace(`/users/${data.id}`);
      }
    }, 1000);

    return () => clearTimeout(timeoutRef);
  }, [isContributor, router, data.id]);

  return (
    <div className="flex flex-col md:flex-row w-full items-start gap-5">
      <section className="w-full md:w-2/5 px-0">
        <div className="flex items-center justify-between pb-4 mb-2  px-5">
          <h2 className="text-xl font-semibold text-white">
            {t("common.personalInformation", "Personal Information")}
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {personalInfo.map((item) =>
            item.value ? (
              <div
                key={item.label}
                className="flex items-center gap-4 px-5 py-2.5 font-medium justify-between text-gray-txt-50"
              >
                <p className="capitalize">{item.label}</p>
                {item.value === "contributor" ? (
                  <ToggleButton
                    enabled={isContributor}
                    onToggle={() => setIsContributor(!isContributor)}
                  />
                ) : item.label === "status" ? (
                  <UserStatus status={item.value as string} />
                ) : (
                  <p className={`${item.label === "email" ? "" : "capitalize"}`}>
                    {item.value}
                  </p>
                )}
              </div>
            ) : null,
          )}
        </div>
      </section>

      <section className="w-full md:w-3/5 px-0">
        <div className="flex flex-col pb-4 mb-2 px-5">
          <h2 className="text-xl font-semibold text-white">
            {t("common.activityOverview", "Activity Overview")}
          </h2>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 mt-3.5">
            {[
              { label: t("common.totalContributions", "Total Contributions"), value: "0" },
              { label: t("common.favoriteWord", "Favorite Word"), value: "0" },
              { label: t("common.recentActivity", "Recent Activity"), value: "0" },
            ].map((item) => (
              <div
                key={item.label}
                className="w-full gap-5 rounded-2xl p-5 bg-gray-txt-200 flex flex-col justify-between"
              >
                <p className="text-gray-txt-50">{item.label}</p>
                <h1 className="text-2xl font-bold text-white ml-4">
                  {item.value}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContributorProfile;
