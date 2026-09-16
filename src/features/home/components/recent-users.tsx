"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { HomeStats } from "../types";
import { PermissionGate } from "@/features/shared";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

const STATUS_STYLES: Record<string, string> = {
  active: "border-green-500/40 bg-green-500/10 text-green-400",
  pending: "border-amber-400/40 bg-amber-500/10 text-amber-400",
  inactive: "border-gray-txt-50/30 bg-gray-txt-50/10 text-gray-txt-50",
  suspended: "border-red-500/40 bg-red-500/10 text-red-400",
};

const RecentUsers = ({
  data,
}: {
  data: HomeStats["recentUsers"] | undefined;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <section className="md:w-1/2 w-full min-w-0 overflow-hidden container px-0">
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-txt-50/30 px-5">
        <h2 className="max-md:text-lg max-md:font-medium text-xl font-semibold text-white">
          {t("home.recentUsers")}
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
        <ul className="px-5 mt-5 overflow-y-scroll overflow-x-hidden max-h-100 custom-scrollbar">
          {data.map((user) => (
            <li
              key={user.id}
              className="py-3 border-b border-gray-txt-50/30 last:border-b-0 min-w-0"
            >
              <Link
                href={`/users/${user.id}`}
                className="flex items-center justify-between gap-3 w-full min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Image
                    src={user.profilePictureUrl || "/default-avatar.svg"}
                    alt={user.firstName}
                    width={36}
                    height={36}
                    className="max-md:h-6 max-md:w-6 h-9 w-9 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-white font-medium capitalize truncate">
                        {user.firstName.toLowerCase()} {user.lastName.toLowerCase()}
                      </span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${STATUS_STYLES[user.status] || STATUS_STYLES.inactive}`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-txt-50 truncate">
                      {user.role} • {user.gender} • {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-txt-50/60 mt-0.5 min-w-0">
                      {(user.province || user.town) && (
                        <span className="flex items-center gap-1 min-w-0 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{[user.town, user.province].filter(Boolean).join(", ")}</span>
                        </span>
                      )}
                      <span className="shrink-0">•</span>
                      <span className="shrink-0">{user.activityStats.totalLogins} {t("home.logins")}</span>
                    </div>
                  </div>
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

export default RecentUsers;
