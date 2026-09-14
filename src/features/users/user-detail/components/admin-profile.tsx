import React from "react";
import type { AdminData } from "../../types";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import moment from "moment";

const AdminProfile = ({ adminData }: { adminData: AdminData }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 w-full items-start gap-5">
      <section className="md:col-span-2 dark-box w-full px-0">
        <div className="flex items-center justify-between pb-4 mb-2 px-5">
          <h2 className="text-xl font-semibold text-white">
            {t("common.personalInformation", "Personal Information")}
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { label: "username", value: adminData?.user?.username },
            { label: "email", value: adminData?.user?.email },
            {
              label: "email verified",
              value: adminData?.user?.isVerified ? t("common.yes", "Yes") : t("common.no", "No"),
            },
            { label: "role", value: adminData?.user?.role },
            { label: "status", value: adminData?.user?.status },
            {
              label: "last login",
              value: moment(adminData?.user?.lastLogin).fromNow(),
            },
            {
              label: "joined date",
              value: moment(adminData?.user?.createdAt).format("DD/MM/YYYY"),
            },
            { label: "active days", value: adminData?.user?.totalActiveDays },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 px-5  py-2.5 max-md:text-sm md:font-medium justify-between text-gray-txt-50"
            >
              <p className="capitalize">{item.label}</p>
              <p className={`${item.label === "email" ? "" : "capitalize"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="md:col-span-3 dark-box px-0">
        <div className="flex flex-col pb-4 mb-2 px-5">
          <h2 className="text-xl font-semibold text-white">
            {t("common.activityOverview", "Activity Overview")}
          </h2>

          <div className="md:grid md:grid-cols-3 flex w-full overflow-x-scroll gap-4 mt-3.5">
            {[
              { label: t("common.totalContributions", "Total Contributions"), value: "0" },
              { label: t("common.wordsAdded", "Words Added"), value: "0" },
              {
                label: t("common.loginActivity", "Login Activity"),
                value: adminData?.user?.loginHistory?.length ?? 0,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="md:w-full w-1/2 max-md:pb-3 gap-3 md:gap-5 shrink-0 rounded-2xl p-5 bg-gray-txt-200 flex flex-col justify-between"
              >
                <p className="text-gray-txt-50 max-md:hidden">{item.label}</p>
                <p className="md:hidden max-md:text-sm">
                  {item.label.includes("Total") || item.label.includes("Recent")
                    ? item.label.split(" ")[1]
                    : item.label}
                </p>

                <h1 className="text-2xl max-md:text-xl font-bold text-white ml-4">
                  {item.value}
                </h1>
              </div>
            ))}
          </div>
        </div>

        <h3 className="font-semibold text-lg text-white px-5 mt-4 mb-2">
          {t("common.loginHistory", "Login History")}
        </h3>

        <div className="flex flex-col gap-2">
          {(adminData.user.loginHistory ?? []).map((item) => (
            <div
              key={item.date}
              className="flex items-center gap-4 px-5 py-2.5 max-md:text-sm md:font-medium justify-between text-gray-txt-50"
            >
              <p>{t("common.loginActivityRecorded", "Login activity recorded")}</p>
              <p>{moment(item.date).format("DD/MM/YYYY")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminProfile;
