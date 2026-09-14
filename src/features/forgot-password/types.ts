import { ForgotPasswordUser } from "@/features/auth/types/auth";

export type ForgotPasswordStep = "verify-email" | "request-reset" | "verify-otp" | "set-password";

export interface ForgotPasswordState {
  step: ForgotPasswordStep;
  email: string;
  user: ForgotPasswordUser | null;
  resetToken: string | null;
}
