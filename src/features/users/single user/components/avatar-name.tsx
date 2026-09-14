"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { StatusCard } from "@/features/shared";
import { getUserStatus } from "@/helpers";
import { useTranslation } from "@/hooks/useTranslation";
import { useUpdateAdminProfileMutation } from "@/slice/requestSlice";
import React, { useState } from "react";
import UpdateProfile from "./update-profile";
import { usePermissions } from "@/hooks/usePermissions";
import { useParams } from "next/navigation";

const AvatarName = ({ user, adminData }: { user: any; adminData: any }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );

  const params = useParams();
  const userId = params.userId as string;

  const { currentUser } = usePermissions();
  const isViewingOwnProfile = currentUser?.id === userId;

  const getStatus = () => {
    if (adminData) return getUserStatus(adminData.user);
    if (user) return getUserStatus(user);
    return "";
  };
  const status = getStatus();

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateAdminProfileMutation();
  return (
    <div className="flex items-start gap-4 flex-1">
      <img
        src={user?.profilePictureUrl ?? "/default-avatar.svg"}
        alt={`${user?.firstName} ${user?.lastName}`}
        className={`lg:h-25 h-16 lg:w-25 w-16 rounded-full object-cover border-2 border-primary-bg ${isViewingOwnProfile ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
        onClick={
          isViewingOwnProfile
            ? () => {
                setProfileFirstName(user?.firstName || "");
                setProfileLastName(user?.lastName || "");
                setProfilePictureFile(null);
                setShowProfileUpdateModal(true);
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
            {/* <span className="">{t("common.role", "Role")}:</span> */}
            <span>{user?.role?.replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>

      {isViewingOwnProfile && (
        <UpdateProfile
          showProfileUpdateModal={showProfileUpdateModal}
          setShowProfileUpdateModal={setShowProfileUpdateModal}
          profileFirstName={profileFirstName}
          setProfileFirstName={setProfileFirstName}
          profileLastName={profileLastName}
          setProfileLastName={setProfileLastName}
          profilePictureFile={profilePictureFile}
          setProfilePictureFile={setProfilePictureFile}
          t={t}
          updateProfile={updateProfile}
          isUpdatingProfile={isUpdatingProfile}
        />
      )}
    </div>
  );
};

export default AvatarName;
