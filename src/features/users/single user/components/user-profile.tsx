import React, { useEffect, useState } from "react";
import {
  LocaleWrapper,
  ToggleButton,
  UserData,
  UserStatus,
} from "@/features/shared";
import moment from "moment";
import { useRouter } from "next/navigation";

const recentActivity: { label: string; value: string }[] = [];

const UserProfile = ({ userData }: { userData: UserData }) => {
  const personalInfo = [
    { label: "username", value: userData?.username },
    { label: "email", value: userData?.email },
    {
      label: "email verified",
      value: userData?.isVerified ? "Yes" : "No",
    },
    { label: "role", value: userData?.role },
    { label: "status", value: userData?.status },
    {
      label: "joined date",
      value: moment(userData?.createdAt).format("DD/MM/YYYY"),
    },
    {
      label: "last login",
      value: moment(userData?.activityStats?.lastLogin).fromNow(),
    },
    {
      label: "total logins",
      value: userData?.activityStats?.totalLogins,
    },

    {
      label: "active days",
      value: userData?.activityStats?.totalActiveDays,
    },
    {
      label: "give contributor access",
      value: "contributor",
    },
  ];

  const router = useRouter();
  const [page, setPage] = React.useState<"profile" | "activity">("profile");
  const [isContributor, setIsContributor] = useState(false);

  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      if (isContributor) {
        router.replace(`/users/${userData.id}?role=contributor`);
      } else {
        router.replace(`/users/${userData.id}`);
      }
    }, 1000);

    return () => clearTimeout(timeoutRef);
  }, [isContributor]);

  return (
    <div className="flex flex-col w-full items-start gap-5 pb-20">
      <div className="flex items-center w-1/2 my-0">
        {[
          { label: "sidebar.profile", value: "profile" },
          { label: "common.activity", value: "activity" },
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

      {page == "profile" && (
        <section className="w-full dark-box px-0">
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
                      onToggle={
                        () => {}
                        // setIsContributor(!isContributor)
                      }
                    />
                  ) : item.label == "status" ? (
                    <UserStatus status={item.value as string} />
                  ) : (
                    <p
                      className={`${item.label == "email" ? "" : "capitalize"}`}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              ) : null,
            )}
          </div>
        </section>
      )}

      {page == "activity" && (
        <section className="w-full dark-box px-0">
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
                  <div className="flex items-center gap-4 px-5 py-2.5 font-medium capitalize justify-between text-gray-txt-50">
                    <p>{item.label}</p>
                    <p>{item.value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default UserProfile;
