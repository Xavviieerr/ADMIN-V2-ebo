"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useGetAdminUsersQuery } from "@/slice/requestSlice";
import { usePermissions } from "@/hooks/usePermissions";
import { getUserList, clampPage } from "../utils/listHelpers";
import {
  DEFAULT_ROLE_FILTER,
  RESTRICTED_ROLE_FILTER,
  STORAGE_KEY_USERS_PAGE,
  STORAGE_KEY_USERS_ROLE,
  STORAGE_KEY_USERS_SEARCH,
  STORAGE_KEY_USERS_STATUS,
  STORAGE_KEY_USERS_SORT_BY,
  STORAGE_KEY_USERS_SORT_ORDER,
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

const PAGE_BEFORE_SEARCH_KEY = "users_page_before_search";

export function useUsersList() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission, isSuperAdmin } = usePermissions();

  const [searchTerm, setSearchTerm] = usePersistedString(STORAGE_KEY_USERS_SEARCH, "");
  const [page, setPage] = usePersistedInt(STORAGE_KEY_USERS_PAGE, 1);
  const [roleFilter, setRoleFilter] = usePersistedString(STORAGE_KEY_USERS_ROLE, DEFAULT_ROLE_FILTER);
  const [statusFilter, setStatusFilter] = usePersistedString(STORAGE_KEY_USERS_STATUS, "all");
  const [sortBy, setSortBy] = usePersistedString(STORAGE_KEY_USERS_SORT_BY, "");
  const [sortOrder, setSortOrder] = usePersistedString(STORAGE_KEY_USERS_SORT_ORDER, "ASC");

  const effectiveRoleFilter = isSuperAdmin ? sanitizeRoleFilter(roleFilter) : RESTRICTED_ROLE_FILTER;
  const [debouncedSearch] = useDebounce(searchTerm.trim(), USERS_SEARCH_DEBOUNCE_MS);

  const {
    data: users,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAdminUsersQuery({
    search: debouncedSearch,
    limit: USERS_LIST_LIMIT,
    page,
    role: effectiveRoleFilter,
    status: statusFilter,
    sortBy: sortBy || undefined,
    sortOrder: sortBy ? sortOrder : undefined,
  });

  const pagination = users?.data
    ? {
        page: users.data.page || 1,
        totalPages: users.data.totalPages || 1,
        totalItems: users.data.total || 0,
        hasNext: users.data.hasNext || false,
        hasPrev: users.data.hasPrev || false,
      }
    : null;

  const userList = getUserList(users?.data);

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
    const defaultRole = isSuperAdmin ? DEFAULT_ROLE_FILTER : RESTRICTED_ROLE_FILTER;
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

  const handleViewUser = (userId: string) => {
    writeBulkStorage([
      [STORAGE_KEY_USERS_PAGE, page.toString()],
      [STORAGE_KEY_USERS_SEARCH, searchTerm],
      [STORAGE_KEY_USERS_ROLE, roleFilter],
      [STORAGE_KEY_USERS_STATUS, statusFilter],
      [STORAGE_KEY_USERS_SORT_BY, sortBy],
      [STORAGE_KEY_USERS_SORT_ORDER, sortOrder],
    ]);
    router.push(`/users/${userId}`);
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
    userList,
    pagination,
    isFetching,
    isError,
    error,
    refetch,
    hasPermission,
    isSuperAdmin,
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
