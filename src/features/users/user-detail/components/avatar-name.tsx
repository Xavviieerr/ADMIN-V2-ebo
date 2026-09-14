"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { StatusCard } from "@/features/shared";
import type { AdminData, UserData } from "../../types";
import { getUserStatus } from "../../utils/getUserStatus";
import { useTranslation } from "@/hooks/useTranslation";
import { useParamUserId } from "../../hooks/useParamUserId";
import { usePermissions } from "@/hooks/usePermissions";
import { useProfileEditor } from "../../hooks/useProfileEditor";
import UpdateProfile from "./update-profile";

const AvatarName = ({
  user,
  adminData,
}: {
  user: UserData | null;
  adminData: AdminData | null;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const userId = useParamUserId();
  const { currentUser } = usePermissions();
  const isViewingOwnProfile = currentUser?.id === userId;

  const {
    showModal,
    setShowModal,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    pictureFile,
    setPictureFile,
    isLoading,
    openEditor,
    handleSubmit,
  } = useProfileEditor();

  const getStatus = () => {
    if (adminData) return getUserStatus(adminData.user);
    if (user) return getUserStatus(user);
    return "";
  };
  const status = getStatus();

  return (
    <div className="flex items-start gap-4 flex-1">
      <img
        src={user?.profilePictureUrl ?? "/default-avatar.svg"}
        alt={`${user?.firstName} ${user?.lastName}`}
        className={`lg:h-25 h-16 lg:w-25 w-16 rounded-full object-cover border-2 border-primary-bg ${isViewingOwnProfile ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
        role={isViewingOwnProfile ? "button" : undefined}
        tabIndex={isViewingOwnProfile ? 0 : undefined}
        aria-label={isViewingOwnProfile ? "Update profile" : undefined}
        onClick={
          isViewingOwnProfile
            ? () => openEditor(user?.firstName || "", user?.lastName || "")
            : undefined
        }
        onKeyDown={
          isViewingOwnProfile
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openEditor(user?.firstName || "", user?.lastName || "");
                }
              }
            : undefined
        }
      />

      <div className="flex-1">
        <div className="flex items-center gap-4">
          <h1 className="text-lg md:text-2xl font-medium md:font-bold text-white">
            {user?.firstName} {user?.lastName}
          </h1>

          {status && (
            <div className="flex items-center gap-2 flex-wrap">
              <StatusCard status={status} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-6 mb-3">
          <span className="text-gray-300 text-base sm:text-lg">
            @{user?.username}
          </span>

          <span className="text-gray-300 text-base sm:text-lg">
            {user?.email}
          </span>

          <div className=" text-gray-300 text-base sm:text-lg capitalize">
            <span>{user?.role?.replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>

      {isViewingOwnProfile && (
        <UpdateProfile
          showModal={showModal}
          setShowModal={setShowModal}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          pictureFile={pictureFile}
          setPictureFile={setPictureFile}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default AvatarName;
