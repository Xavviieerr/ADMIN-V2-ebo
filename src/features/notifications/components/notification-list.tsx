"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import NotificationItem from "./notification-item";
import type { Notification } from "../types";
import { Bell } from "lucide-react";

interface NotificationListProps {
  notifications: Notification[] | undefined;
  isLoading?: boolean;
  compact?: boolean;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export default function NotificationList({
  notifications,
  isLoading,
  compact = false,
  onDelete,
  emptyMessage,
}: NotificationListProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ffe6b0] border-t-transparent" />
      </div>
    );
  }

  if (safeNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Bell className="h-10 w-10 text-gray-600 mb-3" />
        <p className="text-sm text-gray-400">
          {emptyMessage || t("notifications.noNotifications")}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${compact ? "max-h-[400px]" : ""} overflow-y-auto`}>
      {safeNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          compact={compact}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
