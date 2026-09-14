import { AuthUser } from "@/features/auth/types/auth";

export type ProfileUser = AuthUser;

export interface ActivityStats {
  totalLogins?: number;
  lastLogin?: string | null;
}

export interface DetailUser {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
  gender?: string;
  province?: string | null;
  town?: string | null;
  DOB?: string | null;
  profilePictureUrl?: string | null;
  status?: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string | null;
  totalActiveDays?: number;
  suspensionReason?: string;
  activityStats?: ActivityStats;
}

export interface AdminDetails {
  user?: DetailUser;
  status?: string;
  rejectionReason?: string;
  approvedBy?: string | null;
  permissions?: Record<string, boolean>;
}

export interface ApiEnvelope<T> {
  data?: T;
}
