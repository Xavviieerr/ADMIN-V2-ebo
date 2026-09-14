"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon, Mail } from "lucide-react";
import { verifyUserAPI } from "@/features/auth/services/authService";
import { getErrorMessage } from "@/utils/errorHandler";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import { verifyEmailSchema, VerifyEmailFormData } from "../validations";
import { ForgotPasswordUser } from "@/features/auth/types/auth";

interface VerifyUserFormProps {
  onNext: (email: string, user: ForgotPasswordUser) => void;
}

export default function VerifyUserForm({ onNext }: VerifyUserFormProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      setError(null);
      setLoading(true);
      const user = await verifyUserAPI({ email: data.email });
      onNext(data.email, user);
    } catch (err) {
      setError(getErrorMessage(err, "Email not found"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-white mb-2">
        {t("forgotPassword.title")}
      </h2>
      <p className="text-gray-400 mb-8">
        {t("forgotPassword.enterEmail")}
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
          <Mail className="absolute left-4 top-3 text-gray-500" size={18} />
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder={t("forgotPassword.emailPlaceholder")}
            className="input pl-11"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">
              {errors.email.message}
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
            t("forgotPassword.sendResetCode")
          )}
        </button>
      </form>
    </>
  );
}
