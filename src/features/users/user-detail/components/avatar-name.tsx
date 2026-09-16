"use client";

import { StatusCard } from "@/features/shared";
import type { AdminData, UserData } from "../../types";
import { getUserStatus } from "../../utils/getUserStatus";
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
    <div className="flex items-start gap-5 flex-1">
      <img
        src={user?.profilePictureUrl ?? "/default-avatar.svg"}
        alt={`${user?.firstName} ${user?.lastName}`}
        className={`lg:h-24 h-16 lg:w-24 w-16 rounded-full object-cover border-2 border-primary-bg shrink-0 ${isViewingOwnProfile ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
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

      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl md:text-2xl font-bold text-white truncate">
            {user?.firstName} {user?.lastName}
          </h1>
          {status && <StatusCard status={status} />}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
          <span>@{user?.username}</span>
          <span className="hidden sm:inline text-gray-600">·</span>
          <span>{user?.email}</span>
          <span className="hidden sm:inline text-gray-600">·</span>
          <span className="capitalize">{user?.role?.replace(/_/g, " ")}</span>
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
