// Basic user type based on the response
export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "super_admin";
  status: "pending" | "inactive" | "active" | string;
  isActive: boolean;
  isApproved: boolean;
  profilePictureUrl: string | null;
};

export type UserWithRole = {
  email: string;
  firstName: string;
  id: string;
  isActive: boolean;
  isVerified: boolean;
  lastName: string;
  profilePictureUrl: string;
  role: string;
  username: string;
};

// Pagination metadata type
export type PaginationMeta = {  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// API response root type
export type GetUsersResponse = {
  data: {
    items: User[];
  } & PaginationMeta;
  message: string;
};

export type GetUsersResponseSearch = {
  data: {
    users: User[];
  } & PaginationMeta;
  message: string;
};

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  gender?: string;
  profilePictureUrl?: string;
  DOB?: string;
  province?: string;
  town?: string;
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface UploadUserImageResponse {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  original: string;
}

export interface ProfileMutationResponse {
  message: string;
  data?: unknown;
}

export interface SingleAdminUserResponse {
  data?: {
    user?: User;
    status?: string;
    rejectionReason?: string;
  };
  message?: string;
}

export interface SingleUserResponse {
  data?: Partial<User> & Record<string, unknown>;
  message?: string;
}

export interface RestrictUserRequest {
  userId: string;
  suspensionReason: string;
}

export interface RejectUserRequest {
  userId: string;
  rejectionReason: string;
}

export interface InviteAdminRequest {
  email: string;
}

export interface CreateAdminRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  gender: string;
}

export interface UserActionResponse {
  message?: string;
  data?: unknown;
}  
