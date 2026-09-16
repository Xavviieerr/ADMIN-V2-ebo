export const STORAGE_KEY_USERS_PAGE = "users_page";
export const STORAGE_KEY_USERS_SEARCH = "users_search";
export const STORAGE_KEY_USERS_ROLE = "users_role_filter";
export const STORAGE_KEY_USERS_STATUS = "users_status_filter";
export const STORAGE_KEY_USERS_SORT_BY = "users_sort_by";
export const STORAGE_KEY_USERS_SORT_ORDER = "users_sort_order";
export const STORAGE_KEY_ACTIVE_VIEW = "users_active_view";

export const USERS_LIST_LIMIT = 8;
export const USERS_SEARCH_DEBOUNCE_MS = 400;
export const REASON_MAX_LENGTH = 500;

export interface FilterOption {
  value: string;
  /** Raw display text (status list) or translation key (role list) — rendered as-is by each consumer. */
  label: string;
}

export const SORT_BY_OPTIONS: FilterOption[] = [
  { value: "email", label: "Email" },
  { value: "username", label: "Username" },
  { value: "name", label: "Name" },
];

export const SORT_ORDER_OPTIONS: FilterOption[] = [
  { value: "ASC", label: "Ascending" },
  { value: "DESC", label: "Descending" },
];

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "inactive", label: "Inactive" },
];

export const CONTRIBUTOR_STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

export const CONTRIBUTOR_SORT_BY_OPTIONS: FilterOption[] = [
  { value: "name", label: "Name" },
  { value: "username", label: "Username" },
  { value: "expertise", label: "Expertise" },
  { value: "status", label: "Status" },
  { value: "createdAt", label: "Joined Date" },
];

export const ROLE_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "common.allRoles" },
  { value: "admin", label: "common.admin" },
  { value: "user", label: "common.users" },
  { value: "contributors", label: "common.contributors" },
];

export const ADMIN_ROLE_FILTER_OPTIONS: FilterOption[] = [
  { value: "user", label: "common.users" },
  { value: "contributors", label: "common.contributors" },
];

const ALLOWED_ROLE_FILTERS = new Set(
  ROLE_FILTER_OPTIONS.map((o) => o.value).concat(["super_admin"]),
);

export function sanitizeRoleFilter(role: string | null | undefined): string {
  if (!role || !ALLOWED_ROLE_FILTERS.has(role)) return DEFAULT_ROLE_FILTER;
  return role;
}

export const DEFAULT_ROLE_FILTER = "all";
export const RESTRICTED_ROLE_FILTER = "user";

export interface PermissionCategory {
  key: string;
  title: string;
  toggleKey?: string;
}

export const ADMIN_PERMISSION_CATEGORIES: PermissionCategory[] = [
  { key: "user", title: "common.userManagement" },
  { key: "province", title: "common.provinceManagement" },
  { key: "dictionary", title: "common.dictionaryManagement" },
];

export const CONTRIBUTOR_PERMISSION_CATEGORIES: PermissionCategory[] = [
  { key: "province", title: "common.provinceManagement" },
  { key: "dictionary", title: "common.dictionaryManagement" },
  { key: "user", title: "common.sportsManagement", toggleKey: "user" },
  { key: "user", title: "common.guonopediaManagement", toggleKey: "user" },
];
