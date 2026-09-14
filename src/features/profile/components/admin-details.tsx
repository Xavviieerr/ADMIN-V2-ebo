"use client";

import moment from "moment";
import { Activity, AlertCircle, Calendar, Clock, KeyRound, ShieldCheck } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { AdminDetails as AdminDetailsData, DetailUser } from "../types";
import { groupPermissionsByResource } from "../utils/permissions";
import DetailRow from "./detail-row";

interface AdminDetailsProps {
  admin: AdminDetailsData;
  user: DetailUser;
}

export default function AdminDetails({ admin, user }: AdminDetailsProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const statusColor =
    admin.status === "approved"
      ? "bg-green-900 text-green-300"
      : admin.status === "rejected"
        ? "bg-red-900 text-red-300"
        : "bg-orange-900 text-orange-300";

  const permissionGroups = groupPermissionsByResource(admin.permissions);
  const grantedCount = permissionGroups.reduce(
    (total, group) => total + group.actions.length,
    0,
  );

  return (
    <div className="bg-[#2a2a2a] rounded-xl p-6 border border-white/5 mb-6">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5DEB3]/10 text-[#F5DEB3]">
            <ShieldCheck size={15} />
          </span>
          <h3 className="text-white font-semibold">
            {t("profile.adminDetails", "Admin Details")}
          </h3>
        </div>
        {admin.status && (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}
          >
            {admin.status}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div className="divide-y divide-white/5">
          {user.createdAt && (
            <DetailRow
              icon={Calendar}
              label={t("profile.accountCreated", "Account Created")}
              value={moment(user.createdAt).format("DD/MM/YYYY")}
            />
          )}
          {user.lastLogin && (
            <DetailRow
              icon={Clock}
              label={t("profile.lastLogin", "Last Login")}
              value={moment(user.lastLogin).fromNow()}
            />
          )}
        </div>
        <div className="divide-y divide-white/5">
          {typeof user.totalActiveDays === "number" && (
            <DetailRow
              icon={Activity}
              label={t("profile.activeDays", "Active Days")}
              value={user.totalActiveDays}
            />
          )}
          {admin.rejectionReason && (
            <DetailRow
              icon={AlertCircle}
              label={t("profile.rejectionReason", "Rejection Reason")}
              value={admin.rejectionReason}
              valueClassName="text-red-400"
            />
          )}
        </div>
      </div>
      {permissionGroups.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5DEB3]/10 text-[#F5DEB3]">
              <KeyRound size={15} />
            </span>
            <h4 className="text-white text-sm font-semibold">
              {t("profile.permissions", "Permissions")}
            </h4>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F5DEB3]/15 text-[#F5DEB3]">
              {grantedCount}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {permissionGroups.map((group) => (
              <div
                key={group.resource}
                className="rounded-lg bg-[#1e1e1e] border border-white/5 px-4 py-3"
              >
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 mb-2">
                  {group.resource}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.actions.map((action) => (
                    <span
                      key={action}
                      className="px-2 py-0.5 rounded-full text-xs bg-[#F5DEB3]/10 text-[#F5DEB3] border border-[#F5DEB3]/20"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
