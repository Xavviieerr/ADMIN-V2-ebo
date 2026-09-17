"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsReadMutation,
} from "@/slice/requestSlice";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import NotificationList from "./notification-list";

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className }: NotificationBellProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  });

  const { data: notificationsData, isLoading } = useGetNotificationsQuery(
    { page: 1, limit: 5, sortDir: "DESC", sortBy: "createdAt" },
    { skip: !isOpen, pollingInterval: isOpen ? 30000 : 0 }
  );

  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const unreadCount = unreadData?.data?.count ?? 0;
  const notifications = notificationsData?.data?.items ?? [];

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch {
      // Error handled by RTK Query
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`relative p-2 rounded-lg text-[#f5f5f5] hover:bg-[#23232a] hover:text-[#ffe6b0] transition-colors ${className || ""}`}
          aria-label={t("notifications.title")}
          title={t("notifications.title")}
        >
          <Bell className="h-5 w-5 md:h-6 md:w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffe6b0] text-[#1e1e1e] text-xs font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 bg-[#1E1E1E] border border-[#23232a] p-0"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-3 border-b border-[#23232a]">
          <h3 className="text-sm font-semibold text-[#f5f5f5]">
            {t("notifications.title")}
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[#ffe6b0] hover:text-[#f5f5f5]"
              onClick={handleMarkAllRead}
            >
              {t("notifications.markAllRead")}
            </Button>
          )}
        </div>
        <div className="p-2">
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            compact
          />
        </div>
        <div className="p-2 border-t border-[#23232a]">
          <Button
            variant="ghost"
            className="w-full text-sm text-gray-400 hover:text-[#f5f5f5]"
            onClick={() => {
              setIsOpen(false);
              router.push("/notifications");
            }}
          >
            {t("notifications.viewAll")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
