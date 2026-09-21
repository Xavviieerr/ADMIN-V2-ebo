"use client";

import React, { useEffect, useState } from "react";
import { ToggleButton, UserData, UserStatus } from "@/features/shared";
import moment from "moment";
import { useRouter } from "next/navigation";

const recentActivity: { label: string; value: string }[] = [];

const ContributorProfile = ({ data }: { data: UserData }) => {
  const router = useRouter();
  const personalInfo = [
    { label: "username", value: data?.username },
    { label: "email", value: data?.email },
    {
      label: "email verified",
      value: data?.isEmailVerified ? "Yes" : "No",
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
      label: "give contributor access",
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
  }, [isContributor, data.id, router]);

  return (
    <div className="flex w-full items-start gap-5">
      <section className="w-2/5 container px-0">
        <div className="flex items-center justify-between pb-4 mb-2  px-5">
          <h2 className="text-xl font-semibold text-white">
            Personal Information
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
                ) : item.label == "status" ? (
                  <UserStatus status={item.value as string} />
                ) : (
                  <p className={`${item.label == "email" ? "" : "capitalize"}`}>
                    {item.value}
                  </p>
                )}
              </div>
            ) : null,
          )}
        </div>
      </section>

      <section className="w-3/5 container px-0">
        <div className="flex flex-col pb-4 mb-2 px-5">
          <h2 className="text-xl font-semibold text-white">
            Activity Overview
          </h2>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 mt-3.5">
            {[
              { label: "Total Contributions", value: "0" },
              { label: "Favorite Word", value: "0" },
              { label: "Recent Activity", value: "0" },
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

        {recentActivity && recentActivity.length > 0 && (
          <>
            <h3 className="font-semibold text-lg text-white px-5 mt-4 mb-2">
              Recent Activity
            </h3>

            <div className="flex flex-col gap-2">
              {recentActivity.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 px-5 py-2.5 font-medium capitalize justify-between text-gray-txt-50"
                >
                  <p>{item.label}</p>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default ContributorProfile;
