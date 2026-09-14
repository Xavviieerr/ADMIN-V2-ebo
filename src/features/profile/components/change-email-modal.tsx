"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, LoaderIcon, Lock, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
  changeEmailAPI,
  verifyChangeEmailAPI,
} from "@/features/auth/services/authService";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { getErrorMessage } from "@/utils/errorHandler";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const requestCodeSchema = z.object({
  newEmail: z.string().min(1, "Email is required").email("Enter a valid email"),
  currentPassword: z.string().min(1, "Current password is required"),
});

const verifyCodeSchema = z.object({
  code: z
    .string()
    .regex(/^\d{4,6}$/, "Enter the 4–6 digit code"),
});

type RequestCodeFormData = z.infer<typeof requestCodeSchema>;
type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

interface ChangeEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangeEmailModal({
  open,
  onOpenChange,
}: ChangeEmailModalProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { logout } = useLogout();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    reset: resetRequest,
    formState: { errors: requestErrors },
  } = useForm<RequestCodeFormData>({
    resolver: zodResolver(requestCodeSchema),
  });

  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    reset: resetVerify,
    formState: { errors: verifyErrors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setStep("request");
      setNewEmail("");
      setError(null);
      resetRequest();
      resetVerify();
    }
    onOpenChange(value);
  };

  const onRequestCode = async (data: RequestCodeFormData) => {
    try {
      setError(null);
      setLoading(true);
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      await changeEmailAPI(
        { newEmail: data.newEmail, currentPassword: data.currentPassword },
        token,
      );
      setNewEmail(data.newEmail);
      setStep("verify");
    } catch (err) {
      setError(getErrorMessage(err, t("common.error")));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyCode = async (data: VerifyCodeFormData) => {
    try {
      setError(null);
      setLoading(true);
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      await verifyChangeEmailAPI({ newEmail, code: data.code }, token);
      toast.success(t("profile.emailChangedRelogin", "Email changed. Please log in again."));
      onOpenChange(false);
      await logout();
    } catch (err) {
      setError(getErrorMessage(err, t("common.error")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{t("profile.changeEmail", "Change Email")}</DialogTitle>
        </DialogHeader>

        {error && (
          <ErrorMessage
            message={error}
            className="mb-2"
            onRetry={() => setError(null)}
          />
        )}

        {step === "request" ? (
          <form onSubmit={handleRequestSubmit(onRequestCode)} className="space-y-4">
            <div className="flex flex-col items-start gap-2 relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
              <input
                {...registerRequest("newEmail")}
                type="email"
                placeholder={t("profile.newEmail", "New email")}
                className="input pl-10"
              />
              {requestErrors.newEmail && (
                <p className="text-sm text-red-400">
                  {requestErrors.newEmail.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start gap-2 relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
              <input
                {...registerRequest("currentPassword")}
                type={showPassword ? "text" : "password"}
                placeholder={t("profile.currentPassword", "Current password")}
                className="input pl-10"
              />
              {showPassword ? (
                <EyeOff
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  size={16}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  size={16}
                  onClick={() => setShowPassword(true)}
                />
              )}
              {requestErrors.currentPassword && (
                <p className="text-sm text-red-400">
                  {requestErrors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
              >
                {t("profile.cancel", "Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-foreground hover:bg-foreground/90 text-[#1e1e1e]"
              >
                {loading && <LoaderIcon size={16} className="animate-spin mr-2" />}
                {t("profile.sendCode", "Send Code")}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit(onVerifyCode)} className="space-y-4">
            <p className="text-sm text-gray-400">
              {t("profile.codeSentHint", "A verification code was sent to your new email")}
            </p>
            <Input
              {...registerVerify("code")}
              inputMode="numeric"
              placeholder={t("profile.verificationCode", "Verification code")}
              className="bg-[#1e1e1e] border-white/10 text-white text-center tracking-[0.5em]"
            />
            {verifyErrors.code && (
              <p className="text-sm text-red-400">{verifyErrors.code.message}</p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("request")}
              >
                {t("common.back", "Back")}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-foreground hover:bg-foreground/90 text-[#1e1e1e]"
              >
                {loading && <LoaderIcon size={16} className="animate-spin mr-2" />}
                {t("profile.verifyAndChange", "Verify & Change")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
