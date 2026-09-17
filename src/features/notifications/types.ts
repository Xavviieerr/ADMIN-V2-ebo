export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationUnreadCountResponse {
  count: number;
}

export interface NotificationsResponse {
  items: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export type NotificationTypeFilter = "all" | string;
export type NotificationSortBy = "createdAt" | "title";
export type NotificationSortDir = "ASC" | "DESC";

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  sortBy?: NotificationSortBy;
  sortDir?: NotificationSortDir;
}
