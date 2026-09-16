import { User } from "@/types/userTypes";
import type { Contributor } from "../../types";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import UserActionsPopover from "./user-actions-popover";

type MobileUserCardsProps = {
  filteredUsers: User[];
  contributors?: Contributor[];
  isContributorsView?: boolean;
  handleViewUser: (id: string, contributorId?: string) => void;
  handleDelete: (id: string) => void;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
};

const CONTRIBUTOR_STATUS_COLORS: Record<string, string> = {
  approved: "text-green-400",
  pending: "text-orange-400",
  rejected: "text-red-400",
  suspended: "text-yellow-400",
};

const MobileUserCards = ({
  filteredUsers,
  contributors,
  isContributorsView,
  handleViewUser,
  handleDelete,
  isSuperAdmin,
  hasPermission,
  hasActiveFilters,
  resetAllFilters,
}: MobileUserCardsProps) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  if (isContributorsView) {
    return (
      <div className="lg:hidden space-y-4">
        {contributors && contributors.length > 0 ? (
          contributors.map((contributor) => (
            <div
              key={contributor.id}
              role="button"
              tabIndex={0}
              onClick={() => handleViewUser(contributor.user.id, contributor.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleViewUser(contributor.user.id, contributor.id);
                }
              }}
              className="bg-[#1E1E1E] rounded-lg border border-white/10 p-4 space-y-3 cursor-pointer hover:bg-[#2a2a2a]/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-white truncate">
                    {contributor.user.firstName} {contributor.user.lastName}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">
                    @{contributor.user.username}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium capitalize px-2 py-1 rounded ${CONTRIBUTOR_STATUS_COLORS[contributor.status] || "text-gray-400"} bg-white/5`}
                >
                  {contributor.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {t("common.expertise", "Expertise")}:
                  </span>
                  <span className="text-xs sm:text-sm text-gray-300">
                    {contributor.expertise || "-"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-12 text-center text-gray-400">
            <p>{t("common.noContributorsFound", "No contributors found")}</p>
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
  }

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
