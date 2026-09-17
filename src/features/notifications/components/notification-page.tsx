"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  useGetNotificationsQuery,
  useClearAllNotificationsMutation,
  useMarkAllNotificationsReadMutation,
} from "@/slice/requestSlice";
import NotificationItem from "./notification-item";
import NotificationFilters from "./notification-filters";
import NotificationPagination from "./notification-pagination";
import ClearAllDialog from "./clear-all-dialog";
import { Button } from "@/components/ui/button";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import { useState } from "react";

interface NotificationPageProps {
  page: number;
  search: string;
  type: string;
  sortBy: string;
  sortDir: "ASC" | "DESC";
}

export default function NotificationPage({
  page,
  search,
  type,
  sortBy,
  sortDir,
}: NotificationPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [clearAllOpen, setClearAllOpen] = useState(false);

  const isClientSort = sortBy === "title";

  const { data, isLoading } = useGetNotificationsQuery({
    page,
    limit: 8,
    search,
    type,
    sortBy: isClientSort ? "createdAt" : (sortBy as "createdAt"),
    sortDir,
  });

  const [clearAll, { isLoading: isClearing }] = useClearAllNotificationsMutation();
  const [markAllRead, { isLoading: isMarkingAllRead }] = useMarkAllNotificationsReadMutation();

  const rawNotifications = useMemo(() => data?.data?.items ?? [], [data]);
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  const notifications = useMemo(() => {
    if (!isClientSort) return rawNotifications;
    return [...rawNotifications].sort((a, b) =>
      sortDir === "ASC"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
  }, [rawNotifications, isClientSort, sortDir]);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/notifications?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const handleSearch = (newSearch: string) => {
    updateParams({ search: newSearch, page: "1" });
  };

  const handleTypeChange = (newType: string) => {
    updateParams({ type: newType, page: "1" });
  };

  const handleSortChange = (newSortBy: string, newSortDir: string) => {
    updateParams({ sortBy: newSortBy, sortDir: newSortDir, page: "1" });
  };

  const handleClearAll = async () => {
    try {
      await clearAll().unwrap();
      setClearAllOpen(false);
    } catch {
      // Error handled by RTK Query
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch {
      // Error handled by RTK Query
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f5]">
            {t("notifications.title")}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {total} {total === 1 ? "notification" : "notifications"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              className="text-[#ffe6b0] hover:text-[#f5f5f5] hover:bg-[#23232a]"
              onClick={handleMarkAllRead}
              disabled={isMarkingAllRead}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              {t("notifications.markAllRead")}
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              onClick={() => setClearAllOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("notifications.clearAll")}
            </Button>
          )}
        </div>
      </div>

      <NotificationFilters
        search={search}
        type={type}
        sortBy={sortBy}
        sortDir={sortDir}
        onSearch={handleSearch}
        onTypeChange={handleTypeChange}
        onSortChange={handleSortChange}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffe6b0] border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Bell className="h-12 w-12 text-gray-600 mb-4" />
          <p className="text-lg text-gray-400">
            {search || type !== "all"
              ? t("notifications.noSearchResults")
              : t("notifications.noNotifications")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {search || type !== "all"
              ? t("notifications.noSearchResultsDesc")
              : t("notifications.noNotificationsDesc")}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
          <NotificationPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <ClearAllDialog
        open={clearAllOpen}
        onOpenChange={setClearAllOpen}
        onConfirm={handleClearAll}
        isLoading={isClearing}
      />
    </div>
  );
}
