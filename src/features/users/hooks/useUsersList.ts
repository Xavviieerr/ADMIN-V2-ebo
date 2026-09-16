"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  useGetAdminUsersQuery,
  useGetContributorsQuery,
} from "@/slice/requestSlice";
import { usePermissions } from "@/hooks/usePermissions";
import { getUserList, clampPage } from "../utils/listHelpers";
import {
  DEFAULT_ROLE_FILTER,
  STORAGE_KEY_USERS_PAGE,
  STORAGE_KEY_USERS_ROLE,
  STORAGE_KEY_USERS_SEARCH,
  STORAGE_KEY_USERS_STATUS,
  STORAGE_KEY_USERS_SORT_BY,
  STORAGE_KEY_USERS_SORT_ORDER,
  STORAGE_KEY_ACTIVE_VIEW,
  USERS_LIST_LIMIT,
  USERS_SEARCH_DEBOUNCE_MS,
  sanitizeRoleFilter,
} from "../constants";
import {
  usePersistedString,
  usePersistedInt,
  writeBulkStorage,
  readStorage,
  readStorageInt,
} from "./usePersistedState";

const ADMIN_ALLOWED_ROLES = new Set(["user", "contributors"]);

export type ActiveView = "users" | "contributors";

export function useUsersList() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const isAdmin = hasPermission("view_user");

  const [searchTerm, setSearchTerm] = usePersistedString(STORAGE_KEY_USERS_SEARCH, "");
  const [page, setPage] = usePersistedInt(STORAGE_KEY_USERS_PAGE, 1);
  const [roleFilter, setRoleFilter] = usePersistedString(STORAGE_KEY_USERS_ROLE, DEFAULT_ROLE_FILTER);
  const [statusFilter, setStatusFilter] = usePersistedString(STORAGE_KEY_USERS_STATUS, "all");
  const [sortBy, setSortBy] = usePersistedString(STORAGE_KEY_USERS_SORT_BY, "");
  const [sortOrder, setSortOrder] = usePersistedString(STORAGE_KEY_USERS_SORT_ORDER, "ASC");
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const stored = readStorage(STORAGE_KEY_ACTIVE_VIEW, "users");
    return stored === "contributors" ? "contributors" : "users";
  });

  // For non-super admins, restrict to user-only roles
  const sanitizedRole = sanitizeRoleFilter(roleFilter);
  const effectiveRoleFilter = isSuperAdmin
    ? sanitizedRole
    : ADMIN_ALLOWED_ROLES.has(sanitizedRole)
      ? sanitizedRole
      : "user";

  const [debouncedSearch] = useDebounce(searchTerm.trim(), USERS_SEARCH_DEBOUNCE_MS);

  const isContributorsView = activeView === "contributors";

  const {
    data: users,
    isFetching: isUsersFetching,
    isError: isUsersError,
    error: usersError,
    refetch: refetchUsers,
  } = useGetAdminUsersQuery(
    {
      search: debouncedSearch,
      limit: USERS_LIST_LIMIT,
      page,
      role: effectiveRoleFilter,
      status: statusFilter,
      sortBy: sortBy || undefined,
      sortOrder: sortBy ? sortOrder : undefined,
    },
    { skip: isContributorsView },
  );

  const {
    data: contributorsData,
    isFetching: isContributorsFetching,
    isError: isContributorsError,
    error: contributorsError,
    refetch: refetchContributors,
  } = useGetContributorsQuery(
    {
      page,
      limit: USERS_LIST_LIMIT,
      sortBy: sortBy || undefined,
      status: statusFilter,
      sortDir: sortBy ? sortOrder : undefined,
    },
    { skip: !isContributorsView },
  );

  const isFetching = isContributorsView ? isContributorsFetching : isUsersFetching;
  const isError = isContributorsView ? isContributorsError : isUsersError;
  const error = isContributorsView ? contributorsError : usersError;
  const refetch = isContributorsView ? refetchContributors : refetchUsers;

  const contributorList = contributorsData?.data?.items ?? [];
  const contributorsPagination = contributorsData?.data
    ? {
        page: contributorsData.data.page || 1,
        totalPages: contributorsData.data.totalPages || 1,
        totalItems: contributorsData.data.total || 0,
        hasNext: contributorsData.data.hasNext || false,
        hasPrev: contributorsData.data.hasPrev || false,
      }
    : null;

  const pagination = isContributorsView
    ? contributorsPagination
    : users?.data
      ? {
          page: users.data.page || 1,
          totalPages: users.data.totalPages || 1,
          totalItems: users.data.total || 0,
          hasNext: users.data.hasNext || false,
          hasPrev: users.data.hasPrev || false,
        }
      : null;

  const userList = isContributorsView ? [] : getUserList(users?.data);

  // Clamp page when result set shrinks
  useEffect(() => {
    if (pagination && page > pagination.totalPages) {
      setPage(clampPage(page, pagination.totalPages));
    }
  }, [pagination?.totalPages, page, setPage]);

  // Save/restore page before search
  const pageBeforeSearch = useRef<number>(1);

  useEffect(() => {
    const storedSearch = readStorage(STORAGE_KEY_USERS_SEARCH, "");
    if (!storedSearch.trim()) {
      const storedPage = readStorageInt(STORAGE_KEY_USERS_PAGE, 1);
      pageBeforeSearch.current = storedPage;
    }
  }, []);

  // Restore state on navigation
  useEffect(() => {
    if (pathname === "/users") {
      const storedSearch = readStorage(STORAGE_KEY_USERS_SEARCH, "");
      if (storedSearch !== searchTerm) setSearchTerm(storedSearch);
      const storedPage = readStorageInt(STORAGE_KEY_USERS_PAGE, 1);
      if (storedPage !== page) setPage(storedPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Reset on nav-click event
  useEffect(() => {
    const handleNavClick = (event: Event) => {
      const clickedHref = (event as CustomEvent).detail?.href;
      if (clickedHref === "/users") {
        setPage(1);
      }
    };
    window.addEventListener("nav-click", handleNavClick);
    return () => window.removeEventListener("nav-click", handleNavClick);
  }, [setPage]);

  const handleSearchText = (newSearchTerm: string) => {
    const wasSearching = searchTerm.trim().length > 0;
    const willSearch = newSearchTerm.trim().length > 0;

    if (!wasSearching && willSearch) {
      pageBeforeSearch.current = page;
    }

    if (wasSearching && !willSearch) {
      setPage(pageBeforeSearch.current);
    } else if (willSearch) {
      setPage(1);
    }

    setSearchTerm(newSearchTerm);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchText(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(pageBeforeSearch.current);
  };

  const resetAllFilters = () => {
    const defaultRole = isSuperAdmin ? DEFAULT_ROLE_FILTER : "user";
    setSearchTerm("");
    setRoleFilter(defaultRole);
    setStatusFilter("all");
    setSortBy("");
    setSortOrder("ASC");
    setPage(1);
    writeBulkStorage([
      [STORAGE_KEY_USERS_PAGE, "1"],
      [STORAGE_KEY_USERS_SEARCH, ""],
      [STORAGE_KEY_USERS_ROLE, defaultRole],
      [STORAGE_KEY_USERS_STATUS, "all"],
      [STORAGE_KEY_USERS_SORT_BY, ""],
      [STORAGE_KEY_USERS_SORT_ORDER, "ASC"],
    ]);
  };

  const handleRoleFilterChange = (value: string) => {
    if (value === "contributors") {
      setActiveView("contributors");
      setPage(1);
      writeBulkStorage([
        [STORAGE_KEY_ACTIVE_VIEW, "contributors"],
        [STORAGE_KEY_USERS_PAGE, "1"],
      ]);
      return;
    }

    setActiveView("users");
    writeBulkStorage([[STORAGE_KEY_ACTIVE_VIEW, "users"]]);
    setRoleFilter(sanitizeRoleFilter(value));
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
    setPage(1);
  };

  const handleViewUser = (userId: string, contributorId?: string) => {
    writeBulkStorage([
      [STORAGE_KEY_USERS_PAGE, page.toString()],
      [STORAGE_KEY_USERS_SEARCH, searchTerm],
      [STORAGE_KEY_USERS_ROLE, roleFilter],
      [STORAGE_KEY_USERS_STATUS, statusFilter],
      [STORAGE_KEY_USERS_SORT_BY, sortBy],
      [STORAGE_KEY_USERS_SORT_ORDER, sortOrder],
      [STORAGE_KEY_ACTIVE_VIEW, activeView],
    ]);
    const params = new URLSearchParams();
    if (isContributorsView || contributorId) {
      params.set("role", "contributor");
      if (contributorId) params.set("contributorId", contributorId);
    }
    const queryString = params.toString();
    router.push(`/users/${userId}${queryString ? `?${queryString}` : ""}`);
  };

  const goToPage = (next: number) => {
    setPage((prev) => {
      const target = Number.isFinite(next) ? Math.floor(next) : prev;
      return pagination ? clampPage(target, pagination.totalPages) : Math.max(target, 1);
    });
  };

  return {
    searchTerm,
    page,
    roleFilter,
    statusFilter,
    sortBy,
    sortOrder,
    activeView,
    userList,
    contributorList,
    pagination,
    isFetching,
    isError,
    error,
    refetch,
    hasPermission,
    isSuperAdmin,
    isAdmin,
    handleSearchChange,
    handleSearchText,
    clearSearch,
    resetAllFilters,
    handleRoleFilterChange,
    handleStatusFilterChange,
    handleSortByChange,
    handleSortOrderChange,
    handleViewUser,
    handleNext: () => goToPage(page + 1),
    handlePrev: () => goToPage(page - 1),
    goToPage,
  };
}
