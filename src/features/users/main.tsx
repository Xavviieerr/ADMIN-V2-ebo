"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Trash2 } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import {
  UserAnalytics,
  UserFilter,
  SearchFilter,
  UserTable,
  UsersPagination,
  ActionModal,
  MobileUserCards,
} from "./components";
import type { UserStats } from "./types";
import { useUsersList } from "./hooks";
import { useDeleteConfirmation } from "./hooks/useDeleteConfirmation";
import { USERS_LIST_LIMIT } from "./constants";

const UserManagementFeature = ({ data }: { data: UserStats | null }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const {
    searchTerm,
    page,
    roleFilter,
    statusFilter,
    sortBy,
    sortOrder,
    userList: filteredUsers,
    pagination,
    isFetching,
    isError,
    error,
    refetch,
    isSuperAdmin,
    hasPermission,
    handleSearchChange,
    handleSearchText,
    clearSearch,
    resetAllFilters,
    handleRoleFilterChange,
    handleStatusFilterChange,
    handleSortByChange,
    handleSortOrderChange,
    handleViewUser,
    handleNext,
    handlePrev,
    goToPage,
  } = useUsersList();

  const {
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    handleDelete,
    confirmDelete,
  } = useDeleteConfirmation();

  const hasActiveFilters =
    searchTerm.trim().length > 0 || roleFilter !== "all" || statusFilter !== "all";

  if (isFetching && !filteredUsers.length && !pagination) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 text-center">
          <p className="text-lg font-medium">{t("common.errorLoadingUsers")}</p>
          <p className="text-sm text-gray-400 mt-2">
            {getErrorMessage(error, t("common.anErrorOccurred"))}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {t("common.retry", "Retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white max-w-screen">
      {data && <UserAnalytics data={data} />}

      <UserFilter
        role={roleFilter}
        isSuperAdmin={isSuperAdmin}
        handleRoleFilterChange={handleRoleFilterChange}
      />

      <SearchFilter
        searchTerm={searchTerm}
        isFetching={isFetching}
        handleSearchChange={handleSearchChange}
        handleSearchText={handleSearchText}
        clearSearch={clearSearch}
        handleStatusFilterChange={handleStatusFilterChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSortByChange={handleSortByChange}
        handleSortOrderChange={handleSortOrderChange}
      />

      <UserTable
        filteredUsers={filteredUsers}
        handleViewUser={handleViewUser}
        handleDelete={handleDelete}
        isSuperAdmin={isSuperAdmin}
        hasPermission={hasPermission}
      />

      <MobileUserCards
        filteredUsers={filteredUsers}
        handleViewUser={handleViewUser}
        handleDelete={handleDelete}
        isSuperAdmin={isSuperAdmin}
        hasPermission={hasPermission}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
      />

      {pagination && pagination.totalPages > 0 && (
        <div className="flex items-center w-full gap-4 justify-between">
          <UsersPagination
            currentPage={page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            limit={USERS_LIST_LIMIT}
            handleNext={handleNext}
            handlePrev={handlePrev}
            jumpToPage={goToPage}
          />
        </div>
      )}

      <ActionModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title={`${t("common.delete", "Delete")} ${t("common.user", "User")}`}
        titleIcon={<Trash2 className="h-5 w-5 text-red-400" />}
        description={t(
          "messages.confirmDelete",
          "Are you sure you want to delete this item?",
        )}
        cancelLabel={t("common.cancel", "Cancel")}
        confirmLabel={t("common.delete", "Delete")}
        confirmClassName="bg-red-500 hover:bg-red-600 text-white"
        pending={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UserManagementFeature;
