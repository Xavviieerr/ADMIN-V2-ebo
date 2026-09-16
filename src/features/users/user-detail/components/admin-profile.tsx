import React from "react";
import type { AdminData } from "../../types";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import moment from "moment";

const AdminProfile = ({ adminData }: { adminData: AdminData }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div className="w-full">
      <section className="dark-box px-0">
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
              value: adminData?.user?.isVerified
                ? t("common.yes", "Yes")
                : t("common.no", "No"),
            },
            { label: "role", value: adminData?.user?.role },
            { label: "status", value: adminData?.user?.status },
            {
              label: t("common.joinedDate", "Joined Date"),
              value: moment(adminData?.user?.createdAt).format("DD/MM/YYYY"),
            },
            {
              label: t("common.lastLogin", "Last Login"),
              value: adminData?.user?.lastLogin
                ? moment(adminData.user.lastLogin).fromNow()
                : "-",
            },
            {
              label: t("common.activeDays", "Active Days"),
              value: adminData?.user?.totalActiveDays ?? "-",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 px-5 py-2.5 max-md:text-sm md:font-medium justify-between text-gray-txt-50"
            >
              <p className="capitalize">{item.label}</p>
              <p className={`${item.label === "email" ? "" : "capitalize"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminProfile;
