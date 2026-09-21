"use client";

import { useGetSingleUserQuery } from "@/slice/requestSlice";
import Image from "next/image";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import type { User } from "@/types/userTypes";
import { User as UserIcon, Shield } from "lucide-react";

interface TicketUserInfoProps {
  userId: string;
}

function resolveUser(raw: unknown): User | null {
  if (!raw) return null;
  if (typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj.data && typeof obj.data === "object" && "firstName" in (obj.data as object)) {
    return obj.data as User;
  }
  if ("firstName" in obj) return obj as User;
  return null;
}

export default function TicketUserInfo({ userId }: TicketUserInfoProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { data: rawResponse, isLoading, error } = useGetSingleUserQuery({ id: userId });

  if (isLoading) {
    return (
      <div className="bg-[#1E1E1E] border border-[#23232a] rounded-lg p-4">
        <div className="flex items-center justify-center h-16">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ffe6b0] border-t-transparent" />
        </div>
      </div>
    );
  }

  const isAdminError = error && "status" in error && error.status === 400;

  if (isAdminError) {
    return (
      <div className="bg-[#1E1E1E] border border-[#23232a] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#f5f5f5] mb-3">
          {t("supportTickets.userInformation")}
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#23232a] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#ffe6b0]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#f5f5f5]">Admin User</p>
            <p className="text-xs text-gray-400">This ticket was submitted by an administrator</p>
          </div>
        </div>
      </div>
    );
  }

  const user = resolveUser(rawResponse);

  if (!user) {
    return (
      <div className="bg-[#1E1E1E] border border-[#23232a] rounded-lg p-4">
        <p className="text-sm text-gray-400">{t("supportTickets.userInformation")}</p>
        <p className="text-xs text-gray-500 mt-1">Unable to load user information</p>
      </div>
    );
  }

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.username ?? "Unknown";

  return (
    <div className="bg-[#1E1E1E] border border-[#23232a] rounded-lg p-4">
      <h3 className="text-sm font-semibold text-[#f5f5f5] mb-3">
        {t("supportTickets.userInformation")}
      </h3>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#23232a] overflow-hidden flex items-center justify-center shrink-0 relative">
          {user.profilePictureUrl ? (
            <Image
              src={user.profilePictureUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <UserIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#f5f5f5] truncate">{displayName}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
          {user.username && (
            <p className="text-xs text-gray-500 truncate">@{user.username}</p>
          )}
        </div>
      </div>
    </div>
  );
}
