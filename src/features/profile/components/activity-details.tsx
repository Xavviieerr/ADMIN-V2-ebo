"use client";

import moment from "moment";
import {
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  LogIn,
  RefreshCw,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { DetailUser } from "../types";
import DetailRow from "./detail-row";

interface ActivityDetailsProps {
  user: DetailUser;
}

export default function ActivityDetails({ user }: ActivityDetailsProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const lastLogin = user.lastLogin ?? user.activityStats?.lastLogin ?? null;

  return (
    <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5 mb-6">
      <div className="flex items-center gap-2.5 pb-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5DEB3]/10 text-[#F5DEB3]">
          <Activity size={15} />
        </span>
        <h3 className="text-white font-semibold">
          {t("profile.userActivity", "User Activity Information")}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div className="divide-y divide-white/5">
          <DetailRow
            icon={LogIn}
            label={t("profile.totalLogins", "Total Logins")}
            value={user.activityStats?.totalLogins || 0}
          />
          <DetailRow
            icon={Activity}
            label={t("profile.activeDays", "Active Days")}
            value={user.totalActiveDays ?? 0}
          />
          <DetailRow
            icon={Clock}
            label={t("profile.lastLogin", "Last Login")}
            value={
              lastLogin
                ? moment(lastLogin).fromNow()
                : t("profile.never", "Never")
            }
          />
        </div>
        <div className="divide-y divide-white/5">
          {user.createdAt && (
            <DetailRow
              icon={Calendar}
              label={t("profile.accountCreated", "Account Created")}
              value={moment(user.createdAt).format("DD/MM/YYYY")}
            />
          )}
          {user.updatedAt && (
            <DetailRow
              icon={RefreshCw}
              label={t("profile.lastUpdated", "Last Updated")}
              value={moment(user.updatedAt).format("DD/MM/YYYY")}
            />
          )}
          {user.suspensionReason && (
            <DetailRow
              icon={AlertCircle}
              label={t("profile.suspensionReason", "Suspension Reason")}
              value={user.suspensionReason}
              valueClassName="text-red-400"
            />
          )}
        </div>
      </div>
    </div>
  );
}
