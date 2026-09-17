"use client";

import { useSearchParams } from "next/navigation";
import NotificationPage from "@/features/notifications/components/notification-page";

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortDir = (searchParams.get("sortDir") || "DESC") as "ASC" | "DESC";

  return (
    <NotificationPage
      page={page}
      search={search}
      type={type}
      sortBy={sortBy}
      sortDir={sortDir}
    />
  );
}
