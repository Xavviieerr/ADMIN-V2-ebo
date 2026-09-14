'use client'

import { useGetSingleUserQuery, useGetSingleAdminUserQuery, useGenericMutationMutation, useUpdateAdminProfileMutation } from '@/slice/requestSlice';
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'
import { getErrorMessage } from "@/utils/errorHandler";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, XCircle, Settings, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePermissions } from '@/hooks/usePermissions';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocale } from '@/contexts/LocaleContext';


const userDetails = {
  avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  name: 'Ositadinma Nwaubani',
  username: '@osita_n_',
  gender: 'Male',
  role: 'admin',
  email: 'ositanwaubani@outlook.com',
  joinedDate: 'Joined 12th January 2025',
  activeDays: 'Active for 236days',
  mostSearchedWords: [
    { word: 'Isabato', searches: 87, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { word: 'igho', searches: 51, avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { word: 'Oyono', searches: 50, avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { word: 'Oghriki', searches: 41, avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
    { word: 'Erhu', searches: 23, avatar: '/placeholder-icon.svg' },
    { word: 'Erhu', searches: 23, avatar: '/placeholder-icon.svg' },
    { word: 'Erhu', searches: 23, avatar: '/placeholder-icon.svg' },
  ],
  favouriteWords: [
    { word: 'Isabato', searches: null, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { word: 'igho', searches: null, avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { word: 'Oyono', searches: null, avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { word: 'Oghriki', searches: null, avatar: 'https://randomuser.me/api/portraits/men/8.jpg' },
    { word: 'Erhu', searches: null, avatar: '/placeholder-icon.svg' },
    { word: 'Erhu', searches: null, avatar: '/placeholder-icon.svg' },
    { word: 'Erhu', searches: null, avatar: '/placeholder-icon.svg' },
  ],
}

export default function UserDetailsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  // State for modals
  const [showRestrictModal, setShowRestrictModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  // Get current user to check if viewing own profile
  const { currentUser, hasPermission, isSuperAdmin } = usePermissions();
  const isViewingOwnProfile = currentUser?.id === userId;

  // API calls
  const { data: singleUser, isLoading: isLoadingUser } = useGetSingleUserQuery({ id: userId });
  const { data: singleAdminUser, isLoading: isLoadingAdmin } = useGetSingleAdminUserQuery({ id: userId });
  const [addAdmin, { isLoading: isMutating }] = useGenericMutationMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateAdminProfileMutation();

  // Determine if this is an admin user (check if admin data exists)
  const isAdmin = singleAdminUser !== undefined;
  const user = isAdmin ? (singleAdminUser as any)?.data?.user : (singleUser as any)?.data;
  const adminData = (singleAdminUser as any)?.data;
  const userData = (singleUser as any)?.data;
  const isLoading = isLoadingUser || isLoadingAdmin;


  // Handler functions
  const handleRestrict = () => {
    setSuspensionReason("");
    setShowRestrictModal(true);
  };

  const handleReject = () => {
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    try {
      const request = {
        url: `/admin/approve/${userId}`,
        method: "POST" as const,
        invalidatesTags: [{ type: "admins" as const }],
      };

      const result = await addAdmin(request as any).unwrap();
      toast.success("Admin Approved!");
      // Refresh the page or refetch data
      window.location.reload();

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Failed to approve admin"));
    }
  };

  const confirmRestrict = async () => {
    if (!suspensionReason.trim()) {
      toast.error("Please provide a suspension reason");
      return;
    }

    try {
      const request = {
        url: `/admin/users/restrict/${userId}`,
        method: "POST" as const,
        body: { suspensionReason: suspensionReason.trim() },
        invalidatesTags: [{ type: "admins" as const }],
      };

      const result = await addAdmin(request as any).unwrap();
      toast.success("User Restricted!");
      setShowRestrictModal(false);
      setSuspensionReason("");

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Failed to restrict user"));
    }
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const request = {
        url: `/admin/reject/${userId}`,
        method: "POST" as const,
        body: { rejectionReason: rejectionReason.trim() },
        invalidatesTags: [{ type: "admins" as const }],
      };

      const result = await addAdmin(request as any).unwrap();
      toast.success("Admin Rejected!");
      setShowRejectModal(false);
      setRejectionReason("");

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Failed to reject admin"));
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const request = {
        url: `/admin/users/${userId}`,
        method: "DELETE" as const,
        invalidatesTags: [{ type: "admins" as const }],
      };

      await addAdmin(request as any).unwrap();
      toast.success(t('messages.deletedSuccessfully', 'Deleted successfully'));
      setShowDeleteModal(false);
      router.push('/users');
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, t('messages.failedToDelete', 'Failed to delete')));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading user details...</p>
        </div>
      </div>
    );
  }

  // Error state - no user found
  if (!user) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{t('common.user', 'User')} {t('common.notFound', 'not found')}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {t('common.back', 'Back')}
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-[#2a2a2a] flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back', 'Back')}
        </Button>
      </div>
      
      {/* User Profile Section */}
      <div className="rounded-xl p-6 md:p-8 mb-8 relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Avatar + Info */}
        <div className="flex flex-col sm:flex-row items-start gap-6 flex-1">
          <img
            src={user?.profilePictureUrl || '/default_avatar.svg'}
            alt={`${user?.firstName} ${user?.lastName}`}
            className={`h-25 w-25 rounded-full object-cover border-2 border-[#404040] ${isViewingOwnProfile ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            onClick={isViewingOwnProfile ? () => {
              setProfileFirstName(user?.firstName || '')
              setProfileLastName(user?.lastName || '')
              setProfilePictureFile(null)
              setShowProfileUpdateModal(true)
            } : undefined}
          />
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-[36px] font-bold text-white mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{t('common.username', 'Username')}:</span>
                <span className="text-gray-300 text-base sm:text-lg">@{user?.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{t('common.role', 'Role')}:</span>
                <span className="text-gray-300 text-base sm:text-lg capitalize">{user?.role?.replace(/_/g, " ")}</span>
              </div>
              {user?.gender && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{t('common.gender', 'Gender')}:</span>
                  <span className="text-gray-300 text-base sm:text-lg capitalize">{user.gender}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-300 text-sm sm:text-base">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${isAdmin
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
                }`}>
                {isAdmin
                  ? adminData?.status === "approved"
                    ? t('common.approved', 'Approved')
                    : adminData?.status === "rejected"
                      ? t('common.rejected', 'Rejected')
                      : t('common.pending', 'Pending')
                  : user?.role === "admin" && user?.status === "active"
                    ? t('common.approved', 'Approved')
                    : user?.status === "active" ? t('common.active', 'Active')
                    : user?.status === "pending" ? t('common.pending', 'Pending')
                    : user?.status === "inactive" ? t('common.inactive', 'Inactive')
                    : user?.status === "suspended" ? t('common.suspended', 'Suspended')
                    : user?.status
                }
              </span>
            </div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex flex-col gap-2 self-end lg:self-start">
          {isAdmin &&  (
            <button
              onClick={() => router.push(`/users/${userId}/permissions`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage Permissions
            </button>
          )}

          {isAdmin ? (
            adminData?.status === "approved" ? (
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                {t('common.reject', 'Reject')}
              </button>
            ) : adminData?.status === "rejected" ? (
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Approve
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            )
          ) : (
            <button
              onClick={handleRestrict}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              {t('common.restrict', 'Restrict')}
            </button>
          )}

          {/* Delete button */}
          {(isSuperAdmin || hasPermission('delete_user')) && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t('common.delete', 'Delete')}
            </button>
          )}
        </div>
      </div>
      {/* Content Sections */}
      {isAdmin ? (
        /* Admin Status Information */
        <div className="space-y-6">
          {adminData && (
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
              <h3 className="text-white font-medium mb-4">Admin Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 font-medium ${adminData.status === "approved" ? "text-green-400" :
                      adminData.status === "rejected" ? "text-red-400" : "text-orange-400"
                    }`}>
                    {adminData.status?.charAt(0).toUpperCase() + adminData.status?.slice(1)}
                  </span>
                </div>
                {/* <div>
                  <span className="text-gray-400">Created:</span>
                  <span className="ml-2 text-white">
                    {new Date(adminData.createdAt).toLocaleDateString()}
                  </span>
                </div> */}
                <div>
                  <span className="text-gray-400">Email Verified:</span>
                  <span className={`ml-2 font-medium ${user?.isEmailVerified ? "text-green-400" : "text-red-400"
                    }`}>
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
                      : "Never"
                    }
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
                    <span className="ml-2 text-red-400">{adminData.rejectionReason}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* User Information and Words Sections for Regular Users */
        <div className="space-y-6">
          {/* User Activity Information */}
          {userData && (
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
              <h3 className="text-white font-medium mb-4">{t('common.user', 'User')} {t('common.activity', 'Activity')} {t('common.information', 'Information')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">{t('common.totalLogins', 'Total Logins')}:</span>
                  <span className="ml-2 text-white font-medium">
                    {userData.activityStats?.totalLogins || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">{t('common.activeDays', 'Active Days')}:</span>
                  <span className="ml-2 text-white font-medium">
                    {userData?.totalActiveDays ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">{t('common.lastLogin', 'Last Login')}:</span>
                  <span className="ml-2 text-white">
                    {userData?.lastLogin || userData?.activityStats?.lastLogin
                      ? new Date(userData.lastLogin || userData.activityStats.lastLogin).toLocaleDateString()
                      : t('common.never', 'Never')
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">{t('common.emailVerified', 'Email Verified')}:</span>
                  <span className={`ml-2 font-medium ${userData.isEmailVerified ? "text-green-400" : "text-red-400"
                    }`}>
                    {userData.isEmailVerified ? t('common.yes', 'Yes') : t('common.no', 'No')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">{t('common.accountCreated', 'Account Created')}:</span>
                  <span className="ml-2 text-white">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">{t('common.lastUpdated', 'Last Updated')}:</span>
                  <span className="ml-2 text-white">
                    {new Date(userData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {userData.suspensionReason && (
                  <div className="md:col-span-2 lg:col-span-4">
                    <span className="text-gray-400">{t('common.suspensionReason', 'Suspension Reason')}:</span>
                    <span className="ml-2 text-red-400">{userData.suspensionReason}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Words Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Most Searched Words */}
            <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">
                {t('common.mostSearchedWords', 'Most Searched Words')}
              </h2>
              <div className="space-y-1">
                {userDetails.mostSearchedWords.map((word: any, idx: number) => (
                  <div
                    key={word.word + idx}
                    className="flex items-center justify-between py-2 sm:py-3 px-1 hover:bg-[#353535] rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={word.avatar}
                        alt={word.word}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-[#404040]"
                      />
                      <span className="text-white font-medium text-sm">{word.word}</span>
                    </div>
                    <span className="text-gray-400 text-xs sm:text-sm font-medium">
                      {word.searches} {t('common.searches', 'Searches')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Favourite Words */}
            <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">
                Favourite Words
              </h2>
              <div className="space-y-1">
                {userDetails.favouriteWords.map((word: any, idx: number) => (
                  <div
                    key={word.word + idx}
                    className="flex items-center py-2 sm:py-3 px-1 hover:bg-[#353535] rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={word.avatar}
                        alt={word.word}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-[#404040]"
                      />
                      <span className="text-white font-medium text-sm">{word.word}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restrict User Modal */}
      <Dialog open={showRestrictModal} onOpenChange={setShowRestrictModal}>
        <DialogContent className="text-white bg-[#1F1F27] p-6 rounded-lg w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-orange-400" />
              Restrict User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              Please provide a reason for restricting this user. This action will suspend their account.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Suspension Reason *
              </label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder={t('common.enterRestrictionReason', 'Enter the reason for restricting this user...')}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {suspensionReason.length}/500 {t('common.characters', 'characters')}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowRestrictModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={confirmRestrict}
                disabled={!suspensionReason.trim() || isMutating}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isMutating ? t('common.restricting', 'Restricting...') : t('common.restrictUser', 'Restrict User')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Admin Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="text-white bg-[#1F1F27] p-6 rounded-lg w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              Reject Admin
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              Please provide a reason for rejecting this admin application. This action will deny their admin privileges.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejecting this admin application..."
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {rejectionReason.length}/500 characters
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim() || isMutating}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isMutating ? "Rejecting..." : "Reject Admin"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Update Modal */}
      {isViewingOwnProfile && (
        <Dialog open={showProfileUpdateModal} onOpenChange={setShowProfileUpdateModal}>
          <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('common.update', 'Update')} {t('common.profile', 'Profile')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault()
              try {
                await updateProfile({
                  firstName: profileFirstName || undefined,
                  lastName: profileLastName || undefined,
                  profilePicture: profilePictureFile || undefined,
                }).unwrap()
                toast.success('Profile updated successfully')
                setShowProfileUpdateModal(false)
                window.location.reload()
              } catch (error) {
                toast.error(getErrorMessage(error, 'Failed to update profile'))
              }
            }} className="space-y-4">
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
                  const file = e.target.files?.[0]
                  if (file) {
                    setProfilePictureFile(file)
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
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-[#F5DEB3] hover:bg-[#F5DEB3]/90 text-[#1e1e1e]"
                >
                  {isUpdatingProfile ? t('common.updating', 'Updating...') : t('common.update', 'Update') + ' ' + t('common.profile', 'Profile')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="text-white bg-[#1F1F27] p-6 rounded-lg w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              {t('common.delete', 'Delete')} {t('common.user', 'User')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              {t('messages.confirmDelete', 'Are you sure you want to delete this User?')}
            </p>
            <p className="text-sm text-red-400">
              {t('messages.actionCannotBeUndone', 'This action cannot be undone')}
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={confirmDelete}
                disabled={isMutating}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isMutating ? t('common.loading', 'Loading...') : t('common.delete', 'Delete')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
