"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RestrictModal } from "@/components/ui/restrictModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddAdmin from "@/components/addAdmin/addAdmin";
import {
  useGenericMutationMutation,
  useGetAdminUsersQuery,
  useGetAdminUsersSearchQuery,
  useGetAllAdminPermissionsQuery,
} from "@/slice/requestSlice";
import { EyeIcon, MoreVertical, CheckCircle2, XCircle, Settings, Lock, Unlock, X, Keyboard, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import { User } from "@/types/userTypes";
import { usePermissions } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import VirtualUrhoboKeyboard from "@/components/virtualUrhoboKeyboard";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

const STORAGE_KEY_USERS_PAGE = 'users_page'
const STORAGE_KEY_USERS_SEARCH = 'users_search'
const STORAGE_KEY_USERS_ROLE = 'users_role_filter'
const STORAGE_KEY_USERS_STATUS = 'users_status_filter'

// Helper function to generate page numbers for pagination
const getPageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = []
  const maxVisible = 4 // Maximum number of page buttons to show

  if (totalPages <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (currentPage <= 3) {
      // Near the beginning
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // In the middle
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    }
  }

  return pages
}

export default function UsersPage() {

  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_USERS_SEARCH) || ""
    }
    return ""
  });
  const [open, setOpen] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // Initialize page from localStorage
  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedPage = localStorage.getItem(STORAGE_KEY_USERS_PAGE)
      if (storedPage) {
        const pageNum = parseInt(storedPage, 10)
        if (!isNaN(pageNum) && pageNum > 0) {
          return pageNum
        }
      }
    }
    return 1
  });

  const [roleFilter, setRoleFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_USERS_ROLE) || "all"
    }
    return "all"
  });
  const [statusFilter, setStatusFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_USERS_STATUS) || "all"
    }
    return "all"
  });
  const [addAdmin, { isLoading }] = useGenericMutationMutation();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const pathname = usePathname();

  // Store the page before search starts
  const pageBeforeSearch = useRef<number>(1);

  // Initialize pageBeforeSearch from localStorage if no search term on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSearch = localStorage.getItem(STORAGE_KEY_USERS_SEARCH)
      // Only initialize if there's no search term
      if (!storedSearch || storedSearch.trim() === '') {
        const storedPage = localStorage.getItem(STORAGE_KEY_USERS_PAGE)
        if (storedPage) {
          const pageNum = parseInt(storedPage, 10)
          if (!isNaN(pageNum) && pageNum > 0) {
            pageBeforeSearch.current = pageNum
          }
        }
      }
    }
  }, []) // Only run on mount

  // Save to localStorage when values change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USERS_PAGE, page.toString())
      localStorage.setItem(STORAGE_KEY_USERS_SEARCH, searchTerm)
      localStorage.setItem(STORAGE_KEY_USERS_ROLE, roleFilter)
      localStorage.setItem(STORAGE_KEY_USERS_STATUS, statusFilter)
    }
  }, [page, searchTerm, roleFilter, statusFilter])

  // Restore search term when returning to users page (preserve pagination)
  useEffect(() => {
    if (pathname === '/users' && typeof window !== 'undefined') {
      // Restore search term from localStorage when coming back to users page
      const storedSearch = localStorage.getItem(STORAGE_KEY_USERS_SEARCH)
      if (storedSearch !== null && storedSearch !== searchTerm) {
        setSearchTerm(storedSearch)
      }
      // Restore pagination from localStorage (don't reset to page 1)
      const storedPage = localStorage.getItem(STORAGE_KEY_USERS_PAGE)
      if (storedPage) {
        const pageNum = parseInt(storedPage, 10)
        if (!isNaN(pageNum) && pageNum > 0 && pageNum !== page) {
          setPage(pageNum)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Listen for nav click events to reset pagination even when on same page
  useEffect(() => {
    const handleNavClick = (event: CustomEvent) => {
      const clickedHref = event.detail?.href;
      // Reset pagination if clicking on users nav (even if already on that page)
      if (clickedHref === '/users') {
        setPage(1);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_USERS_PAGE, '1');
        }
      }
    };

    window.addEventListener('nav-click', handleNavClick as EventListener);
    return () => {
      window.removeEventListener('nav-click', handleNavClick as EventListener);
    };
  }, [])

  // Modal states for restrict and reject
  const [showRestrictModal, setShowRestrictModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const limit = 6;
  const router = useRouter();

  // Determine which query to use
  const shouldSearch = searchTerm.trim().length > 0;

  const {
    data: users,
    isFetching,
    isError,
    error,
  } = shouldSearch
      ? useGetAdminUsersSearchQuery({ query: searchTerm, limit, page })
      : useGetAdminUsersQuery({ limit, page, role: roleFilter, status: statusFilter });

  // Extract pagination info (users API has pagination fields directly in data, not nested)
  const pagination = users?.data ? {
    page: users.data.page || 1,
    totalPages: users.data.totalPages || 1,
    totalItems: users.data.total || 0,
    hasNext: users.data.hasNext || false,
    hasPrev: users.data.hasPrev || false,
  } : null;

  const { data: userPermissions } = useGetAllAdminPermissionsQuery();
  console.log(userPermissions);

  // Helper function to extract user list from either API response format
  const getUserList = (data: any): User[] => {
    if (data?.items) return data.items;
    if (data?.users) return data.users;
    return [];
  };

  const userList = getUserList(users?.data);

  // No need for frontend filtering since it's now handled by the backend
  const filteredUsers = userList;

  // Handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    const wasSearching = searchTerm.trim().length > 0;
    const willSearch = newSearchTerm.trim().length > 0;

    // If starting a search, save current page
    if (!wasSearching && willSearch) {
      pageBeforeSearch.current = page;
    }

    // If clearing search, restore previous page
    if (wasSearching && !willSearch) {
      setPage(pageBeforeSearch.current);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_USERS_PAGE, pageBeforeSearch.current.toString())
      }
    } else if (willSearch) {
      // If searching (or continuing search), reset to page 1
      setPage(1);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_USERS_PAGE, '1')
      }
    }

    setSearchTerm(newSearchTerm);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USERS_SEARCH, newSearchTerm)
    }
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USERS_PAGE, '1')
      localStorage.setItem(STORAGE_KEY_USERS_ROLE, value)
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USERS_PAGE, '1')
      localStorage.setItem(STORAGE_KEY_USERS_STATUS, value)
    }
  };

  const handleViewUser = (userId: string) => {
    // Save current state to localStorage before navigating
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USERS_PAGE, page.toString())
      localStorage.setItem(STORAGE_KEY_USERS_SEARCH, searchTerm)
      localStorage.setItem(STORAGE_KEY_USERS_ROLE, roleFilter)
      localStorage.setItem(STORAGE_KEY_USERS_STATUS, statusFilter)
    }
    router.push(`/users/${userId}`)
  }

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  // Placeholder functions for approve/reject
  const handleApprove = async (userId: string) => {
    try {
      const request = {
        url: `/admin/approve/${userId}`,
        method: "POST" as const,
        invalidatesTags: [{ type: "admins" as const }],
      };

      const result = await addAdmin(request as any).unwrap();
      toast.success(t('messages.adminApproved'));

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, t('messages.failedToApproveAdmin')));
    }
  };

  const handleReject = (userId: string) => {
    setSelectedUserId(userId);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleSetPermissions = (userId: string) => {
    router.push(`/users/${userId}/permissions`);
  };

  const handleRestrict = (userId: string) => {
    setSelectedUserId(userId);
    setSuspensionReason("");
    setShowRestrictModal(true);
  };

  const handleDelete = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      const request = {
        url: `/admin/users/${selectedUserId}`,
        method: "DELETE" as const,
        invalidatesTags: [{ type: "admins" as const }],
      };

      await addAdmin(request as any).unwrap();
      toast.success(t('messages.deletedSuccessfully', 'Deleted successfully'));
      setShowDeleteModal(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, t('messages.failedToDelete', 'Failed to delete')));
    }
  };

  const handleUnrestrict = async (userId: string) => {
    try {
      const request = {
        url: `/admin/unrestrict/${userId}`,
        method: "POST" as const,
        invalidatesTags: [{ type: "admins" as const }],
      };

      const result = await addAdmin(request as any).unwrap();
      toast.success(t('messages.userUnrestricted'));

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, t('messages.failedToUnrestrictUser')));
    }
  };

  // Functions to handle the actual API calls from modals
  const confirmRestrict = async () => {
    if (!selectedUserId || !suspensionReason.trim()) {
      toast.error(t('messages.pleaseProvideSuspensionReason'));
      return;
    }

    try {
      const request = {
        url: `/admin/users/restrict/${selectedUserId}`,
        method: "POST" as const,
        body: { suspensionReason: suspensionReason.trim() },
        invalidatesTags: [{ type: "admins" as const }],
      };

      const result = await addAdmin(request as any).unwrap();
      toast.success(t('messages.userRestricted'));
      setShowRestrictModal(false);
      setSuspensionReason("");
      setSelectedUserId(null);

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, t('messages.failedToRestrictUser')));
    }
  };

  const confirmReject = async () => {
    if (!selectedUserId || !rejectionReason.trim()) {
      toast.error(t('messages.pleaseProvideRejectionReason'));
      return;
    }

    try {
      const request = {
        url: `/admin/reject/${selectedUserId}`,
        method: "POST" as const,
        body: { rejectionReason: rejectionReason.trim() },
        invalidatesTags: [{ type: "admins" as const }],
      };

      const result = await addAdmin(request as any).unwrap();
      toast.success(t('messages.adminRejected'));
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedUserId(null);

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, t('messages.failedToRejectAdmin')));
    }
  };

  // Loading state
  if (isFetching && !users) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 text-center">
          <p className="text-lg font-medium">{t('common.errorLoadingUsers')}</p>
          <p className="text-sm text-gray-400 mt-2">
            {error && "data" in error ? String(error.data) : t('common.anErrorOccurred')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 mt-4 sm:mt-5">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">{t('common.usersOverview')}</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Search Input */}
          <div className="relative flex-1 w-full z-10">
            <input
              id="users-search-input"
              type="text"
              placeholder={t('common.searchUsers')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-600 bg-transparent py-2 pl-10 pr-20 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-foreground-50 text-sm sm:text-base"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Toggle keyboard"
                title="Virtual Keyboard"
              >
                <Keyboard className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              {searchTerm && !isFetching && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    if (typeof window !== 'undefined') {
                      localStorage.setItem(STORAGE_KEY_USERS_SEARCH, '');
                    }
                  }}
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              {isFetching && (
                <div>
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
          </div>

          {/* Add Admin Button */}
          {(isSuperAdmin || hasPermission('create_user')) && (
            <Button
              onClick={() => setShowAddAdmin(true)}
              className="whitespace-nowrap text-sm sm:text-base"
            >
              {t('common.addAdmin')}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 items-start sm:items-center">
        <p className="text-sm sm:text-base whitespace-nowrap">{t('common.filterBy')}:</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilterChange(e.target.value)}
            className="bg-[#2a2a2a] border border-white/10 rounded-md px-3 sm:px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-foreground-50 text-sm sm:text-base w-full sm:w-auto"
          >
            <option value="all">{t('common.allRoles')}</option>
            <option value="admin">{t('common.admin')}</option>
            <option value="super_admin">{t('common.superAdmin')}</option>
            <option value="user">{t('common.user')}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="bg-[#2a2a2a] border border-white/10 rounded-md px-3 sm:px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-foreground-50 text-sm sm:text-base w-full sm:w-auto"
          >
            <option value="all">{t('common.allStatuses')}</option>
            <option value="active">{t('common.active')}</option>
            <option value="pending">{t('common.pending')}</option>
            <option value="suspended">{t('common.suspended')}</option>
            <option value="inactive">{t('common.inactive')}</option>
          </select>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden lg:block bg-[#1E1E1E] rounded-lg border border-white/10 overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-[#2a2a2a] border-b border-white/10">
              <tr>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">{t('common.firstName')}</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">{t('common.lastName')}</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">{t('common.email')}</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">{t('common.role')}</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs sm:text-sm font-medium text-white">{t('common.status')}</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-center text-xs sm:text-sm font-medium text-white">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: User) => (
                  <tr
                    key={user.id}
                    onClick={() => handleViewUser(user.id)}
                    className="hover:bg-[#2a2a2a]/50 transition-colors cursor-pointer "
                  >
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-white font-medium">
                      {user.firstName}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300 ">
                      {user.lastName}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300 lowercase">
                      {user.email}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300 capitalize">
                      {user.role.replace(/_/g, " ")}
                    </td>
                    <td
                      className={`px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm font-medium capitalize ${user.status === "active"
                        ? "text-green-400"
                        : user.status === "pending"
                          ? "text-orange-400"
                          : user.status === "suspended"
                            ? "text-red-400"
                            : user.status === "inactive"
                              ? "text-gray-400"
                              : "text-red-400"
                        }`}
                    >
                      {user.role === "admin" && user.status === "active" ? t('common.approved') : (user.status === "active" ? t('common.active') : user.status === "pending" ? t('common.pending') : user.status === "suspended" ? t('common.suspended') : user.status === "inactive" ? t('common.inactive') : user.status)}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-[#333]"
                            title={t('common.actions', 'Actions')}
                          >
                            <MoreVertical className="h-4 w-4 text-gray-300" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="bg-[#1e1e1e] border border-gray-700 p-2 w-48"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col">
                            {/* View Profile - Always available */}
                            <Button
                              variant="ghost"
                              className="text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                              onClick={() => handleViewUser(user.id)}
                            >
                              <EyeIcon className="h-4 w-4" />
                              {t('common.viewProfile')}
                            </Button>

                            {/* Admin-specific actions */}
                            {user.role === "admin" && (
                              <>
                                {/* Set Permissions - Only if user has permission */}
                                {(isSuperAdmin || hasPermission('edit_user')) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleSetPermissions(user.id)}
                                  >
                                    <Settings className="h-4 w-4" />
                                    {t('common.setPermissions', 'Set Permissions')}
                                  </Button>
                                )}

                                {/* Approve/Reject based on status - Only if user has permission */}
                                {user.status === "pending" && (isSuperAdmin || hasPermission('edit_user')) && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      className="text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                      onClick={() => handleApprove(user.id)}
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                      {t('common.approve')}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                      onClick={() => handleReject(user.id)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      {t('common.reject', 'Reject')}
                                    </Button>
                                  </>
                                )}

                                {user.status === "active" && (isSuperAdmin || hasPermission('edit_user')) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleReject(user.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </Button>
                                )}

                                {user.status === "inactive" && (isSuperAdmin || hasPermission('edit_user')) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleApprove(user.id)}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {t('common.approve', 'Approve')}
                                  </Button>
                                )}
                              </>
                            )}

                            {/* User-specific actions */}
                            {user.role === "user" && (
                              <>
                                {/* Restrict/Unrestrict based on status */}

                                {(isSuperAdmin || hasPermission('edit_user')) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-orange-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleRestrict(user.id)}
                                  >
                                    <Lock className="h-4 w-4" />
                                    {t('common.restrict')}
                                  </Button>
                                )}

                                {(user.status === "inactive" || user.status === "suspended") && (isSuperAdmin || hasPermission('edit_user')) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleUnrestrict(user.id)}
                                  >
                                    <Unlock className="h-4 w-4" />
                                    {t('common.unrestrict', 'Unrestrict')}
                                  </Button>
                                )}

                                {/* Delete button - Available for all users */}
                                {(isSuperAdmin || hasPermission('delete_user')) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleDelete(user.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    {t('common.delete', 'Delete')}
                                  </Button>
                                )}
                              </>
                            )}

                            {/* Delete button for admin users */}
                            {user.role === "admin" && (isSuperAdmin || hasPermission('delete_user')) && (
                              <Button
                                variant="ghost"
                                className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                {t('common.delete', 'Delete')}
                              </Button>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    {t('common.noUsersFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user: User) => (
            <div
              key={user.id}
              onClick={() => handleViewUser(user.id)}
              className="bg-[#1E1E1E] rounded-lg border border-white/10 p-4 space-y-3 cursor-pointer hover:bg-[#2a2a2a]/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-white truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">{user.email}</p>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[#333] transition-colors shrink-0 ml-2"
                      title="Actions"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-300" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="bg-[#1e1e1e] border border-gray-700 p-2 w-48"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col">
                      {/* View Profile - Always available */}
                      <button
                        className="text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-md flex items-center gap-2"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <EyeIcon className="h-4 w-4" />
                        {t('common.viewProfile')}
                      </button>

                      {/* Admin-specific actions */}
                      {user.role === "admin" && (
                        <>
                          {/* Set Permissions - Only if user has permission */}
                          {(isSuperAdmin || hasPermission('edit_user')) && (
                            <button
                              className="text-left px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
                              onClick={() => handleSetPermissions(user.id)}
                            >
                              <Settings className="h-4 w-4" />
                              {t('common.setPermissions')}
                            </button>
                          )}

                          {/* Approve/Reject based on status - Only if user has permission */}
                          {user.status === "pending" && (isSuperAdmin || hasPermission('edit_user')) && (
                            <>
                              <button
                                className="text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
                                onClick={() => handleApprove(user.id)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                {t('common.approve')}
                              </button>
                              <button
                                className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
                                onClick={() => handleReject(user.id)}
                              >
                                <XCircle className="h-4 w-4" />
                                {t('common.reject')}
                              </button>
                            </>
                          )}

                          {user.status === "active" && (isSuperAdmin || hasPermission('edit_user')) && (
                            <button
                              className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
                              onClick={() => handleReject(user.id)}
                            >
                              <XCircle className="h-4 w-4" />
                              {t('common.reject')}
                            </button>
                          )}

                          {user.status === "inactive" && (isSuperAdmin || hasPermission('edit_user')) && (
                            <button
                              className="text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
                              onClick={() => handleApprove(user.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              {t('common.approve')}
                            </button>
                          )}
                        </>
                      )}

                      {/* User-specific actions */}
                      {user.role === "user" && (
                        <>
                          {/* Restrict/Unrestrict based on status */}

                          {(isSuperAdmin || hasPermission('edit_user')) && (
                            <button
                              className="text-left px-4 py-2 text-sm text-orange-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
                              onClick={() => handleRestrict(user.id)}
                            >
                              <Lock className="h-4 w-4" />
                              {t('common.restrict')}
                            </button>
                          )}

                          {(user.status === "inactive" || user.status === "suspended") && (isSuperAdmin || hasPermission('edit_user')) && (
                            <button
                              className="text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
                              onClick={() => handleUnrestrict(user.id)}
                            >
                              <Unlock className="h-4 w-4" />
                              {t('common.unrestrict')}
                            </button>
                          )}

                          {/* Delete button - Available for all users */}
                          {(isSuperAdmin || hasPermission('delete_user')) && (
                            <button
                              className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              {t('common.delete', 'Delete')}
                            </button>
                          )}
                        </>
                      )}

                      {/* Delete button for admin users */}
                      {user.role === "admin" && (isSuperAdmin || hasPermission('delete_user')) && (
                        <button
                          className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t('common.delete', 'Delete')}
                        </button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{t('common.roleLabel', 'Role')}:</span>
                  <span className="text-xs sm:text-sm text-gray-300 capitalize">
                    {user.role.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{t('common.statusLabel')}</span>
                  <span
                    className={`text-xs sm:text-sm font-medium capitalize ${user.status === "active"
                      ? "text-green-400"
                      : user.status === "pending"
                        ? "text-orange-400"
                        : user.status === "suspended"
                          ? "text-red-400"
                          : user.status === "inactive"
                            ? "text-gray-400"
                            : "text-red-400"
                      }`}
                  >
                    {user.role === "admin" && user.status === "active" ? t('common.approved') : (user.status === "active" ? t('common.active') : user.status === "pending" ? t('common.pending') : user.status === "suspended" ? t('common.suspended') : user.status === "inactive" ? t('common.inactive') : user.status)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-12 text-center text-gray-400">
            {t('common.noUsersFound')}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="sm:gap-2 mt-6 w-full overflow-x-auto scrollbar-hidden mx-auto">
          <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 max-w-[100px] mx-auto">
            <Button
              onClick={() => setPage(1)}
              disabled={page === 1}
              variant="outline"
              className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &lt;&lt;&lt;
            </Button>
            <Button
              onClick={handlePrev}
              disabled={!pagination.hasPrev}
              variant="outline"
              className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &lt;&lt;
            </Button>
            {getPageNumbers(page, pagination.totalPages).map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="text-gray-400 px-1 sm:px-2 text-xs sm:text-sm">
                  ...
                </span>
              ) : (
                <Button
                  key={pageNum}
                  onClick={() => setPage(pageNum as number)}
                  variant={page === pageNum ? "default" : "outline"}
                  className={`shrink-0 border-white/10 text-xs sm:text-sm px-2 sm:px-3 min-w-[32px] sm:min-w-[40px] ${page === pageNum
                    ? "bg-foreground text-[#1e1e1e] hover:bg-[#f5deb3]/90"
                    : "hover:bg-[#2a2a2a] text-gray-300"
                    }`}
                >
                  {pageNum}
                </Button>
              )
            ))}
            <Button
              onClick={handleNext}
              disabled={!pagination.hasNext}
              variant="outline"
              className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &gt;&gt;
            </Button>
            <Button
              onClick={() => setPage(pagination.totalPages)}
              disabled={page === pagination.totalPages}
              variant="outline"
              className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &gt;&gt;&gt;
            </Button>
          </div>
        </div>
      )}

      {/* Restrict Modal */}
      <RestrictModal isOpen={open} setIsOpen={setOpen} />

      {/* Add Admin Modal */}
      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent className="text-white bg-[#1F1F27] p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white mb-4">
              {t('common.addAdmin')}
            </DialogTitle>
          </DialogHeader>
          <AddAdmin onSuccess={() => setShowAddAdmin(false)} />
        </DialogContent>
      </Dialog>

      {/* Restrict User Modal */}
      <Dialog open={showRestrictModal} onOpenChange={setShowRestrictModal}>
        <DialogContent className="text-white bg-[#1F1F27] p-6 rounded-lg w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-orange-400" />
              Restrict User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              {t('common.pleaseProvideRestrictionReason')}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {t('common.suspensionReason')} *
              </label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder={t('common.enterRestrictionReason')}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {suspensionReason.length}/500 characters
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowRestrictModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmRestrict}
                disabled={!suspensionReason.trim() || isLoading}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('common.restricting') : t('common.restrictUser')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId="users-search-input"
          onInput={(text) => {
            // The keyboard will update the input directly via targetInputId
            // This callback is for additional handling if needed
            const targetInput = document.getElementById('users-search-input') as HTMLInputElement;
            if (targetInput) {
              setSearchTerm(targetInput.value);
              if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY_USERS_SEARCH, targetInput.value);
              }
            }
          }}
          onClose={() => setShowKeyboard(false)}
        />
      )}

      {/* Reject Admin Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="text-white bg-[#1F1F27] p-6 rounded-lg w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              {t('common.rejectAdmin')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              {t('common.pleaseProvideRejectionReason')}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {t('common.rejectionReason')} *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t('common.enterRejectionReason')}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {rejectionReason.length}/500 {t('common.characters')}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim() || isLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('common.rejecting') : t('common.rejectAdmin')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="text-white bg-[#1F1F27] p-6 rounded-lg w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              {t('common.delete', 'Delete')} {t('common.user', 'User')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              {t('messages.confirmDelete', 'Are you sure you want to delete this item?')}
            </p>
            <p className="text-sm text-red-400">
              {t('messages.actionCannotBeUndone', 'This action cannot be undone')}
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUserId(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={confirmDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('common.loading', 'Loading...') : t('common.delete', 'Delete')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
