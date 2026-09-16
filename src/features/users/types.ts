export type AdminData = {
  approvedBy: string;
  createdAt: string;
  createdBy: string;
  id: string;
  isActive: boolean;
  permissions: {
    add_media: boolean;
    add_word: boolean;
    create_province: boolean;
    create_user: boolean;
    delete_media: boolean;
    delete_province: boolean;
    delete_user: boolean;
    delete_word: boolean;
    edit_province: boolean;
    edit_user: boolean;
    edit_word: boolean;
    moderate_word: boolean;
    view_province: boolean;
    view_user: boolean;
    view_word: boolean;
  };
  rejectionReason: any | null;
  status:
    | "active"
    | "approved"
    | "pending"
    | "inactive"
    | "suspended"
    | "rejected";
  updatedAt: string;
  user: {
    DOB: string | null;
    activityMilestones: any;
    createdAt: string;
    email: string;
    emailVerificationExpires: string | null;
    emailVerificationToken: string | null;
    firstName: string;
    gender: string;
    id: string;
    isActive: boolean;
    isApproved: boolean;
    isDeleted: boolean;
    isEmailVerified: boolean;
    isOtpVerified: boolean;
    isVerified: boolean;
    lastLogin: string;
    lastLoginAt: string | null;
    lastName: string;
    loginAttempts: {
      count: number;
      lastAttempt: string;
    };
    loginHistory: {
      date: string;
      ipAddress: string;
      userAgent: string;
    }[];
    otpAttempts: any | null;
    otpExpires: string | null;
    otpToken: string | null;
    password: string;
    profilePicturePublicId: string | null;
    profilePictureUrl: string | null;
    province: string | null;
    refreshTokens: any[];
    resetAttempts: any | null;
    resetToken: string | null;
    resetTokenExpires: string | null;
    role: string;
    securityAuditLog: never[];
    status: string;
    suspensionReason: string | null;
    termsAcceptedAt: string | null;
    termsAcceptedIp: string | null;
    termsVersion: string | null;
    totalActiveDays: number;
    town: string | null;
    updatedAt: string;
    username: string;
  };
  userId: string;
};

export type UserData = {
  DOB: string | null;
  activityStats?: {
    totalLogins: number;
    lastLogin: string;
    totalActiveDays: number;
    activityMilestones: any;
  };
  contributionCount?: number;
  createdAt: string;
  dailyActivities?: any[];
  email: string;
  favoriteWordsCount?: number;
  firstName: string;
  gender: string;
  id: string;
  isApproved: boolean;
  isDeleted: boolean;
  isEmailVerified: boolean;
  isOtpVerified: boolean;
  isVerified: boolean;
  lastName: string;
  loginAttempts: {
    count: number;
    lastAttempt: string;
  };
  profilePictureUrl: string | null;
  province: string | null;
  recentActivityCount?: number | null;
  role: string;
  status:
    | "active"
    | "approved"
    | "pending"
    | "inactive"
    | "suspended"
    | "rejected"
    | string;
  suspensionReason: string | null;
  termsAcceptedAt: string | null;
  termsVersion: string | null;
  totalActiveDays: number;
  town: string | null;
  updatedAt: string;
  username: string;
};

export type ContributorApplicationStage =
  | "accountInfo"
  | "rightsRoles"
  | "uploadedTracks"
  | "monetizationSettings";

export type UserStats = {
  totalUsers: number;
  suspendedUsers: number;
  activeUsers: number;
  adminUsers: number;
  contributors: number;
};

export type Contributor = {
  id: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  status: "approved" | "pending" | "rejected" | "suspended";
  applicationNote: string;
  expertise: string;
  submissionCount: number;
  approvedCount: number;
  approvedBy: string | null;
  approvedAt: string | null;
  suspendedBy: string | null;
  suspensionReason: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContributorStats = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  suspended: number;
};

export type ContributorListResponse = {
  items: Contributor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
