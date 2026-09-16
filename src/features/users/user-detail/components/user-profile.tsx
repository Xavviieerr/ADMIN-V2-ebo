"use client";

import React from "react";
import { UserStatus } from "@/features/shared";
import type { UserData, Contributor } from "../../types";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import moment from "moment";

const contributorStatusColors: Record<string, string> = {
  approved: "text-green-400",
  pending: "text-orange-400",
  rejected: "text-red-400",
  suspended: "text-yellow-400",
};

const UserProfile = ({
  userData,
  contributor,
}: {
  userData: UserData;
  contributor?: Contributor;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const personalInfo = [
    { label: "username", value: userData?.username },
    { label: "email", value: userData?.email },
    {
      label: "email verified",
      value: userData?.isEmailVerified
        ? t("common.yes", "Yes")
        : t("common.no", "No"),
    },
    { label: "role", value: userData?.role },
    { label: "status", value: contributor?.status || userData?.status },
    ...(contributor?.expertise
      ? [
          {
            label: t("common.expertise", "Expertise"),
            value: contributor.expertise,
          },
        ]
      : []),
    ...(contributor?.applicationNote
      ? [{ label: "application note", value: contributor.applicationNote }]
      : []),
    ...(contributor?.suspensionReason
      ? [
          {
            label: t("common.suspensionReason", "Suspension Reason"),
            value: contributor.suspensionReason,
          },
        ]
      : []),
    {
      label: t("common.joinedDate", "Joined Date"),
      value: moment(userData?.createdAt).format("DD/MM/YYYY"),
    },
    {
      label: t("common.lastLogin", "Last Login"),
      value: userData?.activityStats?.lastLogin
        ? moment(userData.activityStats.lastLogin).fromNow()
        : "-",
    },
    {
      label: t("common.totalLogins", "Total Logins"),
      value: userData?.activityStats?.totalLogins ?? "-",
    },
    {
      label: t("common.activeDays", "Active Days"),
      value: userData?.activityStats?.totalActiveDays ?? "-",
    },
  ];

  return (
    <div className="w-full">
      <section className="dark-box px-0">
        <div className="flex items-center justify-between pb-4 mb-2 px-5">
          <h2 className="text-xl font-semibold text-white">
            {t("common.personalInformation", "Personal Information")}
          </h2>
        </div>

        {contributor?.suspensionReason && (
          <div className="flex flex-col px-5 py-2 border border-base-red border-dashed rounded-md text-gray-txt-50 mb-5 gap-1 text-sm">
            <p>{t("common.suspensionReason", "Reason for suspension")}:</p>
            <p>{contributor.suspensionReason}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {personalInfo.map((item) =>
            item.value ? (
              <div
                key={item.label}
                className="flex items-center gap-4 px-5 py-2.5 max-md:text-sm md:font-medium justify-between text-gray-txt-50"
              >
                <p className="capitalize">{item.label}</p>
                {item.label === "status" ? (
                  contributor?.status ? (
                    <span
                      className={`font-medium capitalize ${contributorStatusColors[contributor.status] || ""}`}
                    >
                      {contributor.status}
                    </span>
                  ) : (
                    <UserStatus status={item.value as string} />
                  )
                ) : (
                  <p
                    className={`${item.label === "email" ? "" : "capitalize"} ${item.label === "application note" || item.label === t("common.suspensionReason", "Suspension Reason") ? "max-w-[200px] text-right" : ""}`}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            ) : null,
          )}
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
