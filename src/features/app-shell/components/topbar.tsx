"use client";

import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import Image from "next/image";

export default function Topbar() {
  const [notificationCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = usePermissions();
  const { logout } = useLogout();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const name = searchParams.get("name");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTitleAndCrumbs = () => {
    if (params.userId && pathname.includes("/application")) {
      return (
        <>
          <p className="text-xl font-semibold text-[#f5f5f5]">
            {t("common.viewApplication")}
          </p>
          <p
            onClick={() => router.back()}
            className="text-sm text-gray-txt-50 cursor-pointer hover:text-white"
          >
            {t("sidebar.users")} &gt; Contributors &gt; {name ? `${name} > ` : ""}
          </p>
        </>
      );
    }
    return <></>;
  };

  const displayName = currentUser?.firstName
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : currentUser?.username ?? "Admin";

  const avatarUrl = currentUser?.profilePictureUrl;

  return (
    <div className="topbar flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4 bg-[#191919] border-b border-[#23232a] relative z-40">
      <div className="flex flex-col gap-2">{getTitleAndCrumbs()}</div>

      <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
        <LocaleSwitcher />

        <button
          type="button"
          className="relative p-2 rounded-lg text-[#f5f5f5] hover:bg-[#23232a] hover:text-[#ffe6b0] transition-colors"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-5 w-5 md:h-6 md:w-6" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffe6b0] text-[#1e1e1e] text-xs font-semibold">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#23232a] transition-colors"
          >
            <span className="text-sm text-[#f5f5f5] max-md:hidden">
              {displayName}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#23232a] overflow-hidden flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-gray-txt-50" />
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-txt-50 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e1e25] border border-[#23232a] rounded-lg shadow-lg py-1 z-50">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/profile");
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#f5f5f5] hover:bg-[#23232a] transition-colors"
              >
                <User className="w-4 h-4" />
                {t("sidebar.profile")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-[#23232a] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t("sidebar.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
