import { useLocale } from "@/contexts/LocaleContext";
import { getUserStatus, getStatusColor } from "../../utils/getUserStatus";
import { useTranslation } from "@/hooks/useTranslation";
import { User } from "@/types/userTypes";
import type { Contributor } from "../../types";
import UserActionsPopover from "./user-actions-popover";
import moment from "moment";

const CONTRIBUTOR_STATUS_COLORS: Record<string, string> = {
  approved: "text-green-400",
  pending: "text-orange-400",
  rejected: "text-red-400",
  suspended: "text-yellow-400",
};

const UserTable = ({
  filteredUsers,
  contributors,
  isContributorsView,
  handleViewUser,
  handleDelete,
  isSuperAdmin,
  hasPermission,
}: {
  filteredUsers: User[];
  contributors?: Contributor[];
  isContributorsView?: boolean;
  handleViewUser: (id: string, contributorId?: string) => void;
  handleDelete: (id: string) => void;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  if (isContributorsView) {
    return (
      <div className="hidden lg:block bg-[#1E1E1E] rounded overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <caption className="sr-only">{t("common.contributorsOverview", "Contributors Overview")}</caption>
            <thead className="bg-gray-txt-100 border-b border-white/10 text-sm sm:text-base font-medium">
              <tr>
                {([
                  { key: "name", label: t("common.name", "Name") },
                  { key: "username", label: t("common.username", "Username") },
                  { key: "expertise", label: t("common.expertise", "Expertise") },
                  { key: "status", label: t("common.status") },
                  { key: "createdAt", label: t("common.joinedDate", "Joined Date") },
                ] as const).map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="p-5 text-left font-medium text-white"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {contributors && contributors.length > 0 ? (
                contributors.map((contributor) => (
                  <tr
                    key={contributor.id}
                    tabIndex={0}
                    onClick={() => handleViewUser(contributor.user.id, contributor.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleViewUser(contributor.user.id, contributor.id);
                      }
                    }}
                    className="hover:bg-[#2a2a2a]/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-white font-medium">
                      {contributor.user.firstName + " " + contributor.user.lastName}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300">
                      {contributor.user.username}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300">
                      {contributor.expertise || "-"}
                    </td>
                    <td
                      className={`px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm font-medium capitalize ${CONTRIBUTOR_STATUS_COLORS[contributor.status] || "text-gray-400"}`}
                    >
                      {contributor.status}
                    </td>
                    <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300">
                      {moment(contributor.createdAt).format("DD/MM/YYYY")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    {t("common.noContributorsFound", "No contributors found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block bg-[#1E1E1E] rounded overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <caption className="sr-only">{t("common.usersOverview", "Users Overview")}</caption>
          <thead className="bg-gray-txt-100 border-b border-white/10 text-sm sm:text-base font-medium">
            <tr>
              <th scope="col" className="p-5 text-left font-medium text-white">
                {t("common.firstName", "First Name")}
              </th>
              <th scope="col" className="p-5 text-left font-medium text-white">
                {t("common.email")}
              </th>
              <th scope="col" className="p-5 text-left font-medium text-white">
                {t("common.role")}
              </th>
              <th scope="col" className="p-5 text-left font-medium text-white">
                {t("common.status")}
              </th>
              <th scope="col" className="p-5 text-center font-medium text-white">
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredUsers.length > 0 ? (
              filteredUsers
                .filter(
                  (user: User) =>
                    isSuperAdmin ||
                    (user.role !== "admin" && user.role !== "super_admin"),
                )
                .map((user: User) => {
                  const status = getUserStatus(user);
                  return (
                    <tr
                      key={user.id}
                      tabIndex={0}
                      onClick={() => handleViewUser(user.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleViewUser(user.id);
                        }
                      }}
                      className="hover:bg-[#2a2a2a]/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-white font-medium">
                        {user.firstName + " " + user.lastName}
                      </td>
                      <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300 lowercase">
                        {user.email}
                      </td>
                      <td className="px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm text-gray-300 capitalize">
                        {user.role.replace(/_/g, " ")}
                      </td>
                      <td
                        className={`px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm font-medium capitalize ${getStatusColor(status)}`}
                      >
                        {status}
                      </td>
                      <td
                        className="px-4 xl:px-6 py-3 xl:py-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <UserActionsPopover
                          userId={user.id}
                          userRole={user.role}
                          isSuperAdmin={isSuperAdmin}
                          hasPermission={hasPermission}
                          handleViewUser={handleViewUser}
                          handleDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  {t("common.noUsersFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
