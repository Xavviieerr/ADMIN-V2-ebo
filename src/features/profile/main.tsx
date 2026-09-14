"use client";

import {
  useGetSingleUserQuery,
  useGetSingleAdminUserQuery,
} from "@/slice/requestSlice";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useLogout } from "@/features/auth/hooks/useLogout";
import ChangePasswordModal from "./components/change-password-modal";
import ChangeEmailModal from "./components/change-email-modal";
import UpdateProfileModal from "./components/update-profile-modal";
import ProfileHeader from "./components/profile-header";
import AccountDetails from "./components/account-details";
import AdminDetailsCard from "./components/admin-details";
import ActivityDetails from "./components/activity-details";
import {
  AdminDetails,
  ApiEnvelope,
  DetailUser,
} from "./types";

const ProfileFeature = () => {
  const router = useRouter();
  const { logout } = useLogout();
  const { currentUser } = usePermissions();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const userId = currentUser?.id;

  const handleLogout = () => {
    void logout();
  };

  // State for profile modals
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);

  const userInfo = currentUser;
  const isStaffAdmin =
    userInfo?.role === "admin" || userInfo?.role === "super_admin";

  // Contributor endpoint: only relevant for non-admin roles.
  const {
    data: singleUser,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useGetSingleUserQuery({ id: userId || "" }, { skip: !userId || isStaffAdmin });

  const {
    data: singleAdminUser,
    isLoading: isLoadingAdmin,
    refetch: refetchAdmin,
  } = useGetSingleAdminUserQuery({ id: userId || "" }, { skip: !userId });

  // The admin endpoint 404s until the backend fix lands; tolerate the error
  // and render admin-gated sections only when data actually exists.
  const adminData = (singleAdminUser as ApiEnvelope<AdminDetails> | undefined)
    ?.data;

  const userData = (singleUser as ApiEnvelope<DetailUser> | undefined)?.data;
  const isAdmin = Boolean(adminData);

  const user: DetailUser | null =
    adminData?.user ?? userData ?? userInfo ?? null;

  const handleProfileUpdated = () => {
    void refetchUser();
    void refetchAdmin();
  };

  const isLoading = isLoadingUser || isLoadingAdmin;

  // Memoized so the edit modal's identity stays stable across parent
  // re-renders (RTK fetching flags, locale load) while it is open.
  const editInitial = useMemo(
    () => ({
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user?.username,
      gender: user?.gender,
      province: user?.province ?? undefined,
      town: user?.town ?? undefined,
      DOB: user?.DOB ?? undefined,
      profilePictureUrl: user?.profilePictureUrl,
    }),
    [
      user?.firstName,
      user?.lastName,
      user?.username,
      user?.gender,
      user?.province,
      user?.town,
      user?.DOB,
      user?.profilePictureUrl,
    ],
  );

  if (!userId || !user) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white flex flex-col items-center justify-center">
        <p className="text-gray-400">
          {t("profile.loginRequired", "Please log in to view your profile.")}
        </p>
        <button className="primary-btn mt-4" onClick={handleLogout}>
          {t("profile.logout", "Logout")}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const avatarUrl =
    user.profilePictureUrl ||
    userInfo?.profilePictureUrl ||
    "/default-avatar.svg";

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => router.push("/home")}
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-[#2a2a2a] flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("profile.backToHome", "Back to Home")}
          </Button>
        </div>

        <ProfileHeader
          user={user}
          avatarUrl={avatarUrl}
          onAvatarClick={() => setShowProfileUpdateModal(true)}
          onEdit={() => setShowProfileUpdateModal(true)}
          onChangePassword={() => setShowChangePasswordModal(true)}
          onLogout={handleLogout}
        />

        <AccountDetails
          user={user}
          onChangeEmail={() => setShowChangeEmailModal(true)}
        />

        {adminData && <AdminDetailsCard admin={adminData} user={user} />}

        {!isAdmin && userInfo?.role !== "super_admin" && userData && (
          <ActivityDetails user={userData} />
        )}

        <UpdateProfileModal
          open={showProfileUpdateModal}
          onOpenChange={setShowProfileUpdateModal}
          initial={editInitial}
          onUpdated={handleProfileUpdated}
        />

        <ChangePasswordModal
          open={showChangePasswordModal}
          onOpenChange={setShowChangePasswordModal}
        />

        <ChangeEmailModal
          open={showChangeEmailModal}
          onOpenChange={setShowChangeEmailModal}
        />
      </div>
    </div>
  );
};

export default ProfileFeature;
