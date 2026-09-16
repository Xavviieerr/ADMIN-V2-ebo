// Types
export type {
  AuthUser,
  AuthState,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  ForgotPasswordUser,
  VerifyUserRequest,
  RequestResetRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangeEmailRequest,
  VerifyChangeEmailRequest,
  ApiMessageResponse,
} from "./types/auth";

// Validations
export { loginSchema } from "./validations/login";
export type { LoginFormData } from "./validations/login";

// Store
export {
  logInAdmin,
  logOutAdmin,
  updateCurrentUser,
  selectCurrentUser,
  selectAccessToken,
  selectRefreshToken,
  selectIsSuperAdmin,
} from "./store/authSlice";

// Hooks
export { useLogin, useLogout } from "./hooks";

// Services
export {
  loginAPI,
  refreshAPI,
  logoutAPI,
  verifyUserAPI,
  requestResetAPI,
  verifyResetOtpAPI,
  resetPasswordAPI,
  changePasswordAPI,
  changeEmailAPI,
  verifyChangeEmailAPI,
} from "./services/authService";

// Token storage
export { tokenStorage, getAccessToken } from "./utils/tokenStorage";
export { getServerAccessToken, getServerRefreshToken } from "./utils/serverTokenStorage";
export { clearLocalSession, performLogoutCleanup } from "./utils/session";

// Auth interceptor (for RTK Query baseQuery)
export { createBaseQueryWithReauth } from "./utils/authBaseQuery";
