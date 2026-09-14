"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { usePermissionEditor } from "@/features/users/hooks";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { type PermissionCategory } from "../../constants";
import PermissionItem from "./permission-item";

type PermissionPanelProps = {
  userId: string;
  categories: PermissionCategory[];
  className?: string;
};

export default function PermissionPanel({
  userId,
  categories,
  className = "flex flex-col w-full dark-box max-md:mt-10 item-start gap-5",
}: PermissionPanelProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const {
    user,
    isLoading,
    isError,
    refetch,
    permissions,
    getPermissionsByCategory,
    togglePermission,
    toggleAllCategoryPermissions,
  } = usePermissionEditor(userId);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold text-white mb-2">
            {isError ? t("common.failedToLoadUser", "Failed to load user") : t("common.userNotFound", "User not found")}
          </h2>
          <p className="text-gray-400">
            {isError
              ? t("common.somethingWentWrongLoading", "Something went wrong while loading this user.")
              : t("common.userDoesntExist", "The user you're looking for doesn't exist.")}
          </p>
          {isError && (
            <ErrorMessage
              message={t("common.failedToLoadPermissions", "Failed to load permissions.")}
              className="mt-4"
              onRetry={() => refetch()}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-2 lg:mb-5">
        <h2 className="text-lg font-semibold text-white">{t("common.allPermissions", "All Permissions")}</h2>
        <p className="text-gray-txt-50 max-md:text-sm">
          {t("common.viewAllPermissionsDesc", "View all available permissions and their descriptions")}
        </p>
      </div>

      <div className="flex max-w-full w-full max-md:flex-col lg:overflow-x-scroll no-scrollbar gap-4">
        {categories.map((category) => (
          <div
            key={category.title}
            className="bg-[#1E1E1E] rounded-xl py-6 px-4 md:p-6 border border-gray-700 lg:w-1/3 w-full shrink-0"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg max-md:text-base font-semibold text-white">
                {t(category.title)}
              </h3>
              <button
                onClick={() =>
                  toggleAllCategoryPermissions(
                    category.toggleKey ?? category.key,
                  )
                }
                className="text-sm text-gray-400 hover:text-secondary-bg hover:bg-foreground rounded cursor-pointer transition-all px-5 h-auto p-0"
              >
                {t("common.enableAll", "Enable all")}
              </button>
            </div>

            <div className="space-y-4">
              {getPermissionsByCategory(category.key).map((permission) => (
                <PermissionItem
                  key={permission.uiName}
                  title={permission.title}
                  description={permission.description}
                  enabled={permissions[permission.uiName] || false}
                  onToggle={() => togglePermission(permission.uiName)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
