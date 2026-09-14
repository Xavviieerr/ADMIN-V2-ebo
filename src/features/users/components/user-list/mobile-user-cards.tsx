import { User } from "@/types/userTypes";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import UserActionsPopover from "./user-actions-popover";

type MobileUserCardsProps = {
  filteredUsers: User[];
  handleViewUser: (id: string) => void;
  handleDelete: (id: string) => void;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
};

const MobileUserCards = ({
  filteredUsers,
  handleViewUser,
  handleDelete,
  isSuperAdmin,
  hasPermission,
  hasActiveFilters,
  resetAllFilters,
}: MobileUserCardsProps) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div className="lg:hidden space-y-4">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user: User) => (
          <div
            key={user.id}
            role="button"
            tabIndex={0}
            onClick={() => handleViewUser(user.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleViewUser(user.id);
              }
            }}
            className="bg-[#1E1E1E] rounded-lg border border-white/10 p-4 space-y-3 cursor-pointer hover:bg-[#2a2a2a]/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-medium text-white truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  {user.email}
                </p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <UserActionsPopover
                  userId={user.id}
                  userRole={user.role}
                  isSuperAdmin={isSuperAdmin}
                  hasPermission={hasPermission}
                  handleViewUser={handleViewUser}
                  handleDelete={handleDelete}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {t("common.roleLabel", "Role")}:
                </span>
                <span className="text-xs sm:text-sm text-gray-300 capitalize">
                  {user.role.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-12 text-center text-gray-400">
          <p>{t("common.noUsersFound")}</p>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="mt-4 text-sm text-[#F5DEB3] hover:text-[#ffe6b0] transition-colors"
            >
              {t("common.clearFilters", "Clear search & filters")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileUserCards;
