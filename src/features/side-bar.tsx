"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserIcon,
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  Settings,
  Gamepad2,
  FileText,
  Volleyball,
  LanguagesIcon,
  HistoryIcon,
  BrainCog,
  Music,
  LayoutDashboardIcon,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
// import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { TreePalmIcon } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import Image from "next/image";

const navigation = [
  {
    translationKey: "sidebar.home",
    href: "/home",
    icon: LayoutDashboardIcon,
    permission: null,
  }, // Always show home
  {
    translationKey: "sidebar.users",
    href: "/users",
    icon: UserIcon,
    permission: "view_user",
  },
  {
    translationKey: "sidebar.guonopedia",
    href: "#",
    icon: GlobeAltIcon,
    permission: "view_word",
    children: [
      {
        translationKey: "sidebar.dictionary",
        href: "/guonopedia/dictionary",
        icon: BookOpenIcon,
        permission: "view_word",
      },
      {
        translationKey: "sidebar.names",
        href: "/guonopedia/names",
        icon: UserIcon,
        permission: null,
      },
      {
        translationKey: "sidebar.culture",
        href: "#",
        icon: LanguagesIcon,
        permission: "view_culture",
      },
      {
        translationKey: "sidebar.historicalFigures",
        href: "/guonopedia/figures",
        icon: HistoryIcon,
        permission: null,
      },
      {
        translationKey: "sidebar.proverbsAndIdioms",
        href: "#",
        icon: BrainCog,
        permission: "view_proverb",
      },
      {
        translationKey: "sidebar.traditionalMusic",
        href: "#",
        icon: Music,
        permission: "view_music",
      },
      {
        translationKey: "sidebar.folktales",
        href: "#",
        icon: BookOpenIcon,
        permission: "view_folktale",
      },
    ],
  },
  {
    translationKey: "sidebar.sports",
    href: "#",
    icon: Volleyball,
    permission: "view_sport",
  },
  {
    translationKey: "sidebar.quiz",
    href: "/games",
    icon: Gamepad2,
    permission: null,
  },
  {
    translationKey: "sidebar.province",
    href: "/province",
    icon: TreePalmIcon,
    permission: "view_province",
  },
  {
    translationKey: "sidebar.permissions",
    href: "/permissions",
    icon: Settings,
    permission: null,
    superAdminOnly: true,
  },
];

export default function SidebarV2() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { hasPermission, isSuperAdmin } = usePermissions();
  const { logout } = useLogout();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  // Auto-expand items if current path matches
  useEffect(() => {
    navigation.forEach((item) => {
      if (item.children) {
        const isActive =
          pathname === item.href ||
          item.children.some((child) => pathname === child.href);
        if (isActive) {
          setExpandedItems((prev) => new Set(prev).add(item.translationKey));
        }
      }
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md bg-[#191919] text-[#ffe6b0] focus:outline-none"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "flex flex-col h-full w-64 bg-[#191919] border-r border-[#23232a] p-6 fixed md:static z-50 transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header with logo + close */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/home">
            <Image
              src="/logo_bright.svg"
              alt="Gwono"
              width={120}
              height={32}
              className="rounded-md"
            />
          </Link>
          <button
            className="md:hidden p-2 rounded-md text-[#ffe6b0]"
            onClick={() => setMobileOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Nav links (stick to top) */}
        <nav className="flex flex-col gap-2 mb-8 mt-5 h-[calc(100vh-200px)] max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#23232a] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#2a2a2a]">
          {navigation.map((item) => {
            // Show item if no permission required, user is super admin, or has the required permission
            // Also check if it's super admin only
            const shouldShow =
              (item.superAdminOnly ? isSuperAdmin : true) &&
              (!item.permission ||
                isSuperAdmin ||
                hasPermission(item.permission));

            if (!shouldShow) return null;

            // Check if item has children
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.has(item.translationKey);
            const isActive =
              pathname === item.href ||
              (hasChildren &&
                item.children?.some((child) => pathname === child.href));

            // Handler to dispatch nav click event
            const handleNavClick = (href: string) => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("nav-click", { detail: { href } }),
                );
                // When Dictionary tab is clicked, set flag so DictionaryOverview clears search on mount (in case it wasn't mounted yet)
                if (href === "/dictionary") {
                  sessionStorage.setItem("dictionary-clear-search", "1");
                }
                // When Province tab is clicked, set flag so ProvinceOverview resets pagination on mount
                if (href === "/province") {
                  sessionStorage.setItem("province-clear-pagination", "1");
                }
              }
            };

            if (hasChildren) {
              return (
                <div key={item.translationKey} className="flex flex-col">
                  <button
                    onClick={() => {
                      setExpandedItems((prev) => {
                        const newSet = new Set(prev);
                        if (newSet.has(item.translationKey)) {
                          newSet.delete(item.translationKey);
                        } else {
                          newSet.add(item.translationKey);
                        }
                        return newSet;
                      });
                    }}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition w-full",
                      isActive
                        ? " text-white shadow"
                        : "text-[#f5f5f5] hover:bg-[#23232a] hover:text-[#ffe6b0]",
                    )}
                  >
                    <item.icon
                      className={clsx(
                        "h-6 w-6",
                        isActive ? "text-[#ffe6b0]" : "text-[#ffe6b0]",
                      )}
                    />
                    <span className="flex-1 text-left">
                      {t(item.translationKey)}
                    </span>
                    {isExpanded ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </button>
                  {isExpanded && item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const childShouldShow =
                          !child.permission ||
                          isSuperAdmin ||
                          hasPermission(child.permission);
                        if (!childShouldShow) return null;

                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.translationKey}
                            href={child.href}
                            onClick={() => {
                              setMobileOpen(false);
                              handleNavClick(child.href);
                            }}
                            className={clsx(
                              "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                              isChildActive
                                ? "bg-[#ffe6b0] text-black shadow"
                                : "text-[#f5f5f5] hover:bg-[#23232a] hover:text-[#ffe6b0]",
                            )}
                          >
                            <child.icon
                              className={clsx(
                                "h-5 w-5",
                                isChildActive ? "text-black" : "text-[#ffe6b0]",
                              )}
                            />
                            {t(child.translationKey)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.translationKey}
                href={item.href}
                onClick={() => {
                  setMobileOpen(false);
                  handleNavClick(item.href);
                }}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition",
                  pathname === item.href
                    ? "bg-[#ffe6b0] text-black shadow"
                    : "text-[#f5f5f5] hover:bg-[#23232a] hover:text-[#ffe6b0]",
                )}
              >
                <item.icon
                  className={clsx(
                    "h-6 w-6",
                    pathname === item.href ? "text-black" : "text-[#ffe6b0]",
                  )}
                />
                {t(item.translationKey)}
              </Link>
            );
          })}
        </nav>

        {/* Push guidelines and logout to bottom only */}
        <div className="mt-auto space-y-2">
          <Link
            href="/guidelines"
            onClick={() => setMobileOpen(false)}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition w-full",
              pathname === "/guidelines"
                ? "bg-[#ffe6b0] text-black shadow"
                : "text-[#f5f5f5] hover:bg-[#23232a] hover:text-[#ffe6b0]",
            )}
          >
            <FileText
              className={clsx(
                "h-6 w-6",
                pathname === "/guidelines" ? "text-black" : "text-[#ffe6b0]",
              )}
            />
            {t("sidebar.guidelines")}
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              logout();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition w-full text-[#f5f5f5] hover:bg-[#23232a] hover:text-red-400"
          >
            <LogOut className="h-6 w-6" />
            {t("sidebar.logout")}
          </button>
        </div>
      </aside>
    </>
  );
}
