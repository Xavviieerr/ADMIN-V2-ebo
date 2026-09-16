"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HomeStats } from "../types";
import { PermissionGate } from "@/features/shared";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

const TopUsers = ({
  data,
}: {
  data: HomeStats["topUsers"] | undefined;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <section className="md:w-1/2 w-full container px-0">
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-txt-50/30 px-5">
        <h2 className="max-md:text-lg max-md:font-medium text-xl font-semibold text-white">
          {t("home.topUsers")}
        </h2>
        <PermissionGate permission="view_user">
          <Link
            href={"/users"}
            className="primary-btn flex items-center gap-2 text-sm font-medium"
          >
            {t("home.viewAll")}
          </Link>
        </PermissionGate>
      </div>

      {data && data.length > 0 && (
        <ul className="space-y-4 px-5 mt-5 overflow-y-scroll max-h-100 custom-scrollbar">
          {data.map((user) => (
            <li
              key={user.id}
              className="flex py-3 border-b border-gray-txt-50/30 last:border-b-0"
            >
              <Link
                href={`/users/${user.id}`}
                className="flex items-center justify-between gap-3 w-full"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={"/default-avatar.svg"}
                    alt={user.first_name}
                    width={36}
                    height={36}
                    className="max-md:h-6 max-md:w-6 h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-medium capitalize">
                      {user.first_name.toLowerCase() +
                        " " +
                        user.last_name.toLowerCase()}
                    </div>
                    <div className="text-xs text-gray-txt-50">{user.email}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end text-gray-txt-50 text-xs">
                  <p>{t("common.activeDays")}:</p>
                  <p>{user.active_days} {t("common.activity")}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {(!data || data.length === 0) && (
        <p className="px-5 max-md:pt-4 md:py-9 w-full text-center text-gray-txt-50">
          {t("home.nothingHere")}
        </p>
      )}
    </section>
  );
};

export default TopUsers;
