import type {
  Notification,
  NotificationsResponse,
  NotificationUnreadCountResponse,
  GetNotificationsParams,
} from "../types";
import type { AppEndpointBuilder } from "@/slice/endpoints/types";

export const notificationEndpoints = (builder: AppEndpointBuilder) => ({
  getNotifications: builder.query<
    { data: NotificationsResponse },
    GetNotificationsParams
  >({
    query: ({ page = 1, limit = 5, search, type, sortBy = "createdAt", sortDir = "DESC" }) => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (type && type !== "all") params.append("type", type);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortDir) params.append("sortDir", sortDir);
      return {
        url: `/notifications?${params.toString()}`,
        method: "GET",
      };
    },
    providesTags: ["notifications"],
  }),

  getUnreadCount: builder.query<{ data: NotificationUnreadCountResponse }, void>({
    query() {
      return {
        url: "/notifications/unread-count",
        method: "GET",
      };
    },
    providesTags: ["notifications"],
  }),

  markNotificationRead: builder.mutation<
    { data: Notification },
    { notificationId: string }
  >({
    query({ notificationId }) {
      return {
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      };
    },
    invalidatesTags: ["notifications"],
  }),

  markAllNotificationsRead: builder.mutation<{ message: string }, void>({
    query() {
      return {
        url: "/notifications/read-all",
        method: "PATCH",
      };
    },
    invalidatesTags: ["notifications"],
  }),

  deleteNotification: builder.mutation<
    { message: string },
    { notificationId: string }
  >({
    query({ notificationId }) {
      return {
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      };
    },
    invalidatesTags: ["notifications"],
  }),

  clearAllNotifications: builder.mutation<{ message: string }, void>({
    query() {
      return {
        url: "/notifications/clear-all",
        method: "DELETE",
      };
    },
    invalidatesTags: ["notifications"],
  }),
});
