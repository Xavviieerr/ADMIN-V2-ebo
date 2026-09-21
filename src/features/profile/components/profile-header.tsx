"use client";

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Lock, Pencil } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { DetailUser } from "../types";

interface ProfileHeaderProps {
  user: DetailUser;
  avatarUrl: string;
  onAvatarClick: () => void;
  onEdit: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

function formatRole(role?: string): string {
  if (!role) return "";
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProfileHeader({
  user,
  avatarUrl,
  onAvatarClick,
  onEdit,
  onChangePassword,
  onLogout,
}: ProfileHeaderProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    user.email ||
    "";
  const verified = user.isVerified || user.isEmailVerified;
  const roleLabel = formatRole(user.role);

  return (
    <div className="rounded-xl overflow-hidden mb-6 border border-white/5 bg-[#23232a]">
      <div className="h-20 md:h-24 bg-gradient-to-r from-[#F5DEB3]/25 via-[#F5DEB3]/10 to-transparent flex items-start justify-end p-4">
        {roleLabel && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F5DEB3]/15 text-[#F5DEB3] border border-[#F5DEB3]/25">
            {roleLabel}
          </span>
        )}
      </div>
      <div className="px-6 md:px-8 pb-6 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-10 md:-mt-12 mb-6">
          <Image
            src={avatarUrl}
            alt={displayName}
            width={112}
            height={112}
            className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover border-4 border-[#23232a] ring-2 ring-[#404040] cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.svg";
            }}
            onClick={onAvatarClick}
          />
          <div className="flex-1 min-w-0 sm:pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-white truncate">
                {displayName}
              </h1>
              {verified && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                  {t("profile.verified", "Verified")}
                </span>
              )}
            </div>
            {user.username && (
              <p className="text-gray-400 text-sm sm:text-base mt-1 truncate">
                @{user.username}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e] font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              {t("profile.updateProfile", "Update Profile")}
            </button>
            <button
              onClick={onChangePassword}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-200 font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              {t("profile.changePassword", "Change Password")}
            </button>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-red-400/90 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 sm:ml-auto"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            {t("profile.signOut", "Sign out")}
          </button>
        </div>
      </div>
    </div>
  );
}
