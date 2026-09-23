export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "admin";
  isVerified: boolean;
  lastLogin: string;
  profilePictureUrl: string | null;
}

export interface LoginRequest {
  email?: string;
  userName?: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: AuthUser | null;
}

export interface ForgotPasswordUser {
  id?: string;
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
}

export interface VerifyUserRequest {
  email: string;
}

export interface RequestResetRequest {
  email: string;
  userId: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  resetToken?: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string | null;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  currentPassword: string;
}

export interface VerifyChangeEmailRequest {
  newEmail: string;
  code: string;
}

export interface ApiMessageResponse {
  message: string;
}
