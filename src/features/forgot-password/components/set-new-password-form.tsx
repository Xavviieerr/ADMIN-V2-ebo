"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, LoaderIcon, Lock } from "lucide-react";
import { resetPasswordAPI } from "@/features/auth/services/authService";
import { getErrorMessage } from "@/utils/errorHandler";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import { resetPasswordSchema, ResetPasswordFormData } from "../validations";

interface SetNewPasswordFormProps {
  email: string;
  resetToken: string | null;
}

export default function SetNewPasswordForm({
  email,
  resetToken,
}: SetNewPasswordFormProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError(null);
      setLoading(true);
      await resetPasswordAPI({
        email,
        resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success(t("forgotPassword.resetPassword"));
      router.push("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-white mb-2">
        {t("forgotPassword.setNewPassword")}
      </h2>
      <p className="text-gray-400 mb-8">
        {t("forgotPassword.createPasswordDescription")}
      </p>

      {error && (
        <ErrorMessage
          message={error}
          className="mb-6"
          onRetry={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-start gap-2 relative">
          <Lock className="absolute left-4 top-3 text-gray-500" size={18} />
          <input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("forgotPassword.newPasswordPlaceholder")}
            className="input pl-11"
          />
          {showPassword ? (
            <EyeOff
              className="absolute right-4 top-3 cursor-pointer text-gray-500"
              size={18}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              className="absolute right-4 top-3 cursor-pointer text-gray-500"
              size={18}
              onClick={() => setShowPassword(true)}
            />
          )}
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 relative">
          <Lock className="absolute left-4 top-3 text-gray-500" size={18} />
          <input
            {...register("confirmPassword")}
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder={t("forgotPassword.confirmPasswordPlaceholder")}
            className="input pl-11"
          />
          {showConfirm ? (
            <EyeOff
              className="absolute right-4 top-3 cursor-pointer text-gray-500"
              size={18}
              onClick={() => setShowConfirm(false)}
            />
          ) : (
            <Eye
              className="absolute right-4 top-3 cursor-pointer text-gray-500"
              size={18}
              onClick={() => setShowConfirm(true)}
            />
          )}
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="primary-btn flex justify-center items-center w-full mt-4"
          disabled={loading}
        >
          {loading ? (
            <LoaderIcon size="24" className="animate-spin text-primary-bg" />
          ) : (
            t("forgotPassword.resetPassword")
          )}
        </button>
      </form>
    </>
  );
}
