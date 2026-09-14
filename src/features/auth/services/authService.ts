import { BASE_URL } from "@/utils/constants";
import {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  VerifyUserRequest,
  ForgotPasswordUser,
  RequestResetRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangeEmailRequest,
  VerifyChangeEmailRequest,
  ApiMessageResponse,
} from "@/features/auth/types/auth";

export async function loginAPI(request: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      data?.message ??
      (Array.isArray(data?.message) ? data.message[0] : null) ??
      "Login failed";
    throw new Error(typeof message === "string" ? message : "Login failed");
  }

  return res.json();
}

export async function refreshAPI(request: RefreshRequest): Promise<RefreshResponse> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: request.refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Token refresh failed");
  }

  return res.json();
}

// Temporary: logs out ALL sessions. Will be replaced when backend supports single-session logout.
export async function logoutAPI(token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/sessions/logout-all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Logout request failed");
  }
}

function extractApiError(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (Array.isArray(message)) return typeof message[0] === "string" ? message[0] : fallback;
    if (typeof message === "string") return message;
  }
  return fallback;
}

export async function verifyUserAPI(
  request: VerifyUserRequest,
): Promise<ForgotPasswordUser> {
  const res = await fetch(`${BASE_URL}/auth/verify-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractApiError(data, "Failed to verify email"));
  }

  return data?.userInfo || data;
}

export async function requestResetAPI(
  request: RequestResetRequest,
): Promise<ApiMessageResponse> {
  const res = await fetch(`${BASE_URL}/auth/enhanced-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractApiError(data, "Failed to send reset code"));
  }

  return data;
}

export async function verifyResetOtpAPI(
  request: VerifyOtpRequest,
): Promise<VerifyOtpResponse> {
  const res = await fetch(`${BASE_URL}/auth/verify-reset-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractApiError(data, "Invalid verification code"));
  }

  return data;
}

export async function resetPasswordAPI(
  request: ResetPasswordRequest,
): Promise<ApiMessageResponse> {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractApiError(data, "Failed to reset password"));
  }

  return data;
}

export async function changePasswordAPI(
  request: ChangePasswordRequest,
  token: string,
): Promise<ApiMessageResponse> {
  const res = await fetch(`${BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractApiError(data, "Failed to change password"));
  }

  return data;
}

export async function changeEmailAPI(
  request: ChangeEmailRequest,
  token: string,
): Promise<ApiMessageResponse> {
  const res = await fetch(`${BASE_URL}/auth/change-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractApiError(data, "Failed to change email"));
  }

  return data;
}

export async function verifyChangeEmailAPI(
  request: VerifyChangeEmailRequest,
  token: string,
): Promise<ApiMessageResponse> {
  const res = await fetch(`${BASE_URL}/auth/change-email/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractApiError(data, "Failed to verify email change"));
  }

  return data;
}
