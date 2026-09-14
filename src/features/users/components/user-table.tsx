import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { getUserStatus } from "@/helpers";
import { useTranslation } from "@/hooks/useTranslation";
import { User, UserWithRole } from "@/types/userTypes";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { MoreVertical, EyeIcon, Trash2 } from "lucide-react";
import React from "react";

const UserTable = ({
  filteredUsers,
  handleViewUser,
  handleDelete,
  isSuperAdmin,
  hasPermission,
}: {
  filteredUsers: UserWithRole[];
  handleViewUser: (id: string) => void;
  handleDelete: (id: string) => void;
  isSuperAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div className="hidden lg:block bg-[#1E1E1E] rounded  overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-txt-100 border-b border-white/10 text-sm sm:text-base font-medium">
            <tr>
              <th className="p-5 text-left font-medium text-white">
                {t("common.firstName")}
              </th>
              <th className="p-5 text-left  font-medium text-white">
                {t("common.email")}
              </th>
              <th className="p-5 text-left font-medium text-white">
                {t("common.role")}
              </th>
              <th className="p-5  text-left font-medium text-white">
                {t("common.status")}
              </th>
              <th className="p-5 text-center font-medium text-white">
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: UserWithRole) => {
                if (
                  !isSuperAdmin &&
                  (user.role === "admin" || user.role === "super_admin")
                ) {
                  return <></>;
                }
                const status = getUserStatus(user);
                return (
                  <tr
                    key={user.id}
                    onClick={() => handleViewUser(user.id)}
                    className="hover:bg-[#2a2a2a]/50 transition-colors cursor-pointer "
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
                      className={`px-4 xl:px-6 py-3 xl:py-4 text-xs sm:text-sm font-medium capitalize ${
                        status === "active"
                          ? "text-green-400"
                          : status === "pending"
                            ? "text-orange-400"
                            : status === "suspended"
                              ? "text-yellow-400"
                              : status === "rejected"
                                ? "text-red-400"
                                : status === "deleted"
                                  ? "text-red-400"
                                  : "text-gray-400"
                      }`}
                    >
                      {status}
                    </td>
                    <td
                      className="px-4 xl:px-6 py-3 xl:py-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-[#333]"
                            title={t("common.actions", "Actions")}
                          >
                            <MoreVertical className="h-4 w-4 text-gray-300" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="bg-[#1e1e1e] border border-gray-700 p-2 w-48"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col gap-2">
                            {/* View Profile - Always available */}
                            <Button
                              variant="ghost"
                              className="text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                              onClick={() => handleViewUser(user.id)}
                            >
                              <EyeIcon className="h-4 w-4" />
                              {t("common.viewProfile")}
                            </Button>

                            {/* Admin-specific actions */}
                            {/* {user.role === "admin" && (
                            <>
                              {(isSuperAdmin || hasPermission("edit_user")) && (
                                <Button
                                  variant="ghost"
                                  className="text-left px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                  onClick={() => handleSetPermissions(user.id)}
                                >
                                  <Settings className="h-4 w-4" />
                                  {t(
                                    "common.setPermissions",
                                    "Set Permissions",
                                  )}
                                </Button>
                              )}

                              {user.status === "pending" &&
                                (isSuperAdmin ||
                                  hasPermission("edit_user")) && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      className="text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                      onClick={() => handleApprove(user.id)}
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                      {t("common.approve")}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                      onClick={() => handleReject(user.id)}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      {t("common.reject", "Reject")}
                                    </Button>
                                  </>
                                )}

                              {user.status === "active" &&
                                (isSuperAdmin ||
                                  hasPermission("edit_user")) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleReject(user.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </Button>
                                )}

                              {user.status === "inactive" &&
                                (isSuperAdmin ||
                                  hasPermission("edit_user")) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleApprove(user.id)}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {t("common.approve", "Approve")}
                                  </Button>
                                )}
                            </>
                          )} */}

                            {/* User-specific actions */}
                            {user.role === "user" && (
                              <>
                                {/* {(isSuperAdmin || hasPermission("edit_user")) && (
                                <Button
                                  variant="ghost"
                                  className="text-left px-4 py-2 text-sm text-orange-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                  onClick={() => handleRestrict(user.id)}
                                >
                                  <Lock className="h-4 w-4" />
                                  {t("common.restrict")}
                                </Button>
                              )}

                              {(user.status === "inactive" ||
                                user.status === "suspended") &&
                                (isSuperAdmin ||
                                  hasPermission("edit_user")) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleUnrestrict(user.id)}
                                  >
                                    <Unlock className="h-4 w-4" />
                                    {t("common.unrestrict", "Unrestrict")}
                                  </Button>
                                )} */}

                                {/* Delete button - Available for all users */}
                                {(isSuperAdmin ||
                                  hasPermission("delete_user")) && (
                                  <Button
                                    variant="ghost"
                                    className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                    onClick={() => handleDelete(user.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    {t("common.delete", "Delete")}
                                  </Button>
                                )}
                              </>
                            )}

                            {/* Delete button for admin users */}
                            {user.role === "admin" &&
                              (isSuperAdmin ||
                                hasPermission("delete_user")) && (
                                <Button
                                  variant="ghost"
                                  className="text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md flex items-center gap-2 justify-start h-auto"
                                  onClick={() => handleDelete(user.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  {t("common.delete", "Delete")}
                                </Button>
                              )}
                          </div>
                        </PopoverContent>
                      </Popover>
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
