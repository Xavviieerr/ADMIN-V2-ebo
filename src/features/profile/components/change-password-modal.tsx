"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, LoaderIcon, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { changePasswordAPI } from "@/features/auth/services/authService";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { getErrorMessage } from "@/utils/errorHandler";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import {
  changePasswordSchema,
  ChangePasswordFormData,
} from "../validations/change-password";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangePasswordModal({
  open,
  onOpenChange,
}: ChangePasswordModalProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { logout } = useLogout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setError(null);
      setLoading(true);
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");

      await changePasswordAPI(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword,
        },
        token,
      );

      toast.success(t("changePassword.success"));
      reset();
      onOpenChange(false);
      await logout();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to change password"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset();
      setError(null);
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("changePassword.title")}</DialogTitle>
        </DialogHeader>

        {error && (
          <ErrorMessage
            message={error}
            className="mb-2"
            onRetry={() => setError(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-start gap-2 relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
            <input
              {...register("currentPassword")}
              type={showCurrent ? "text" : "password"}
              placeholder={t("changePassword.currentPlaceholder")}
              className="input pl-10"
            />
            {showCurrent ? (
              <EyeOff
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                size={16}
                onClick={() => setShowCurrent(false)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                size={16}
                onClick={() => setShowCurrent(true)}
              />
            )}
            {errors.currentPassword && (
              <p className="text-sm text-red-400">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-2 relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
            <input
              {...register("newPassword")}
              type={showNew ? "text" : "password"}
              placeholder={t("changePassword.newPlaceholder")}
              className="input pl-10"
            />
            {showNew ? (
              <EyeOff
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                size={16}
                onClick={() => setShowNew(false)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                size={16}
                onClick={() => setShowNew(true)}
              />
            )}
            {errors.newPassword && (
              <p className="text-sm text-red-400">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-2 relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
            <input
              {...register("confirmNewPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder={t("changePassword.confirmPlaceholder")}
              className="input pl-10"
            />
            {showConfirm ? (
              <EyeOff
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                size={16}
                onClick={() => setShowConfirm(false)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                size={16}
                onClick={() => setShowConfirm(true)}
              />
            )}
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-400">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              {t("changePassword.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-foreground hover:bg-foreground/90 text-[#1e1e1e]"
            >
              {loading ? (
                <LoaderIcon size={16} className="animate-spin mr-2" />
              ) : null}
              {loading ? t("changePassword.changing") : t("changePassword.button")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
