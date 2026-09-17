"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useMarkNotificationReadMutation, useDeleteNotificationMutation } from "@/slice/requestSlice";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import type { Notification } from "../types";
import { getRelativeTime } from "../utils/notification-helpers";

interface NotificationItemProps {
  notification: Notification;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export default function NotificationItem({ notification, onDelete, compact = false }: NotificationItemProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotification, { isLoading: isDeleting }] = useDeleteNotificationMutation();
  const [isRead, setIsRead] = useState(notification.isRead);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMarkRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markRead({ notificationId: notification.id }).unwrap();
      setIsRead(true);
    } catch {
      // Optimistic update rollback handled by RTK Query
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification({ notificationId: notification.id }).unwrap();
      onDelete?.(notification.id);
    } catch {
      // Error handled by RTK Query
    }
  };

  const relativeTime = mounted
    ? getRelativeTime(notification.createdAt, t)
    : "";

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        isRead
          ? "bg-[#1E1E1E] border-[#23232a] opacity-70"
          : "bg-[#1E1E1E] border-[#ffe6b0]/30"
      }`}
    >
      {!isRead && (
        <div className="mt-1.5 h-2 w-2 rounded-full bg-[#ffe6b0] shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isRead ? "text-gray-400" : "text-[#f5f5f5]"}`}>
          {notification.title}
        </p>
        {!compact && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {notification.body}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {relativeTime || "\u00A0"}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!isRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-[#f5f5f5]"
            onClick={handleMarkRead}
            title={t("notifications.markAsRead")}
            aria-label={t("notifications.markAsRead")}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-red-400"
          onClick={handleDelete}
          disabled={isDeleting}
          title={t("notifications.delete")}
          aria-label={t("notifications.delete")}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
