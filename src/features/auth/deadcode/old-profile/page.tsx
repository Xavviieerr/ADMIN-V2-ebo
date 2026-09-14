"use client";

import {
  useGetSingleUserQuery,
  useGetSingleAdminUserQuery,
  useUpdateAdminProfileMutation,
} from "@/slice/requestSlice";
import {
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/usePermissions";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { logOutAdmin } from "@/slice/authAdmin";
import { clearPaginationState } from "@/utils/localStorage";
import Cookies from "js-cookie";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentUser } = usePermissions();
  const userId = currentUser?.id;

  const handleLogout = async () => {
    clearPaginationState();
    dispatch(logOutAdmin());
    router.push("/login");
  };

  // State for profile update modal
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );

  // API calls
  const { data: singleUser, isLoading: isLoadingUser } = useGetSingleUserQuery(
    { id: userId || "" },
    { skip: !userId },
  );

  const userInfo = JSON.parse(Cookies.get("user") || "{}");
  const { data: singleAdminUser, isLoading: isLoadingAdmin } =
    useGetSingleAdminUserQuery({ id: userInfo?.id || "" }, { skip: !userId });

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateAdminProfileMutation();

  // Determine if this is an admin user (check if admin data exists)
  const isAdmin = singleAdminUser !== undefined;
  const user = isAdmin
    ? (singleAdminUser as any)?.data?.user
    : (singleUser as any)?.data;

  const adminData = (singleAdminUser as any)?.data;
  const userData = (singleUser as any)?.data;

  console.log("admin data", adminData);
  console.log("user data", userData);
  console.log("user", userInfo);
  const isLoading = isLoadingUser || isLoadingAdmin;

  if (!userId) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white flex items-center justify-center">
        <p className="text-gray-400">Please log in to view your profile.</p>
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

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-[#2a2a2a] flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* User Profile Section */}
      <div className="rounded-xl p-6 md:p-8 mb-8 relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Avatar + Info */}
        <div className="flex flex-col sm:flex-row items-start gap-6 flex-1">
          <img
            src={user?.profilePictureUrl || "/default_avatar.svg"}
            alt={`${user?.firstName} ${user?.lastName}`}
            className="h-25 w-25 rounded-full object-cover border-2 border-[#404040] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              setProfileFirstName(user?.firstName || "");
              setProfileLastName(user?.lastName || "");
              setProfilePictureFile(null);
              setShowProfileUpdateModal(true);
            }}
          />
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-[36px] font-bold text-white mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Username:</span>
                <span className="text-gray-300 text-base sm:text-lg">
                  @{user?.username}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Role:</span>
                <span className="text-gray-300 text-base sm:text-lg capitalize">
                  {user?.role?.replace(/_/g, " ")}
                </span>
              </div>
              {user?.gender && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Gender:</span>
                  <span className="text-gray-300 text-base sm:text-lg capitalize">
                    {user.gender}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-300 text-sm sm:text-base">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isAdmin
                    ? adminData?.status === "approved"
                      ? "bg-green-900 text-green-300"
                      : adminData?.status === "rejected"
                        ? "bg-red-900 text-red-300"
                        : "bg-orange-900 text-orange-300"
                    : user?.status === "active"
                      ? "bg-green-900 text-green-300"
                      : user?.status === "pending"
                        ? "bg-orange-900 text-orange-300"
                        : user?.status === "inactive"
                          ? "bg-gray-900 text-gray-300"
                          : "bg-red-900 text-red-300"
                }`}
              >
                {isAdmin
                  ? adminData?.status === "approved"
                    ? "Approved"
                    : adminData?.status === "rejected"
                      ? "Rejected"
                      : "Pending"
                  : user?.role === "admin" && user?.status === "active"
                    ? "Approved"
                    : user?.status}
              </span>
            </div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex flex-col gap-2 self-end lg:self-start">
          {isAdmin && (
            <button
              onClick={() => router.push(`/users/${userId}?v=permissions`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage Permissions
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 border-2 border-red-500 cursor-pointer text-red-500 font-medium text-sm rounded-md transition-colors flex items-center gap-2"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Content Sections */}
      {isAdmin ? (
        /* Admin Status Information */
        <div className="space-y-6">
          {adminData && (
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
              <h3 className="text-white font-medium mb-4">
                Admin Status Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`ml-2 font-medium ${
                      adminData.status === "approved"
                        ? "text-green-400"
                        : adminData.status === "rejected"
                          ? "text-red-400"
                          : "text-orange-400"
                    }`}
                  >
                    {adminData.status?.charAt(0).toUpperCase() +
                      adminData.status?.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Email Verified:</span>
                  <span
                    className={`ml-2 font-medium ${
                      user?.isEmailVerified ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {user?.isEmailVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Account Created:</span>
                  <span className="ml-2 text-white">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Last Login:</span>
                  <span className="ml-2 text-white">
                    {user?.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Active Days:</span>
                  <span className="ml-2 text-white font-medium">
                    {user?.totalActiveDays ?? 0}
                  </span>
                </div>
                {adminData.rejectionReason && (
                  <div className="md:col-span-2">
                    <span className="text-gray-400">Rejection Reason:</span>
                    <span className="ml-2 text-red-400">
                      {adminData.rejectionReason}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Activity Information */}
          {userData && (
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
              <h3 className="text-white font-medium mb-4">
                User Activity Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Logins:</span>
                  <span className="ml-2 text-white font-medium">
                    {userData.activityStats?.totalLogins || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Active Days:</span>
                  <span className="ml-2 text-white font-medium">
                    {userData?.totalActiveDays ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Last Login:</span>
                  <span className="ml-2 text-white">
                    {userData?.lastLogin || userData?.activityStats?.lastLogin
                      ? new Date(
                          userData.lastLogin ||
                            userData.activityStats.lastLogin,
                        ).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Email Verified:</span>
                  <span
                    className={`ml-2 font-medium ${
                      userData.isEmailVerified
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {userData.isEmailVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Account Created:</span>
                  <span className="ml-2 text-white">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="ml-2 text-white">
                    {new Date(userData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {userData.suspensionReason && (
                  <div className="md:col-span-2 lg:col-span-4">
                    <span className="text-gray-400">Suspension Reason:</span>
                    <span className="ml-2 text-red-400">
                      {userData.suspensionReason}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Update Modal */}
      <Dialog
        open={showProfileUpdateModal}
        onOpenChange={setShowProfileUpdateModal}
      >
        <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateProfile({
                  firstName: profileFirstName || undefined,
                  lastName: profileLastName || undefined,
                  profilePicture: profilePictureFile || undefined,
                }).unwrap();
                toast.success("Profile updated successfully");
                setShowProfileUpdateModal(false);
                window.location.reload();
              } catch (error) {
                toast.error(getErrorMessage(error, "Failed to update profile"));
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={profileFirstName}
                onChange={(e) => setProfileFirstName(e.target.value)}
                className="bg-[#1e1e1e] border-white/10 text-white"
                placeholder="First name"
              />
              <Input
                value={profileLastName}
                onChange={(e) => setProfileLastName(e.target.value)}
                className="bg-[#1e1e1e] border-white/10 text-white"
                placeholder="Last name"
              />
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProfilePictureFile(file);
                }
              }}
              className="bg-[#1e1e1e] border-white/10 text-white"
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowProfileUpdateModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e]"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
