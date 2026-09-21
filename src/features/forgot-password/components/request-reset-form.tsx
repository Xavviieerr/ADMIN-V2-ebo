"use client";

import { useState } from "react";
import Image from "next/image";
import { ForgotPasswordUser } from "@/features/auth/types/auth";
import { requestResetAPI } from "@/features/auth/services/authService";
import { getErrorMessage } from "@/utils/errorHandler";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { LoaderIcon, Mail } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

interface RequestResetFormProps {
  email: string;
  user: ForgotPasswordUser;
  onNext: () => void;
  onBack: () => void;
}

export default function RequestResetForm({
  email,
  user,
  onNext,
  onBack,
}: RequestResetFormProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestReset = async () => {
    try {
      setError(null);
      setLoading(true);
      await requestResetAPI({ email, userId: user.userId || user.id || "" });
      toast.success(t("forgotPassword.sendCode"), {
        description: t("forgotPassword.otpDescription"),
      });
      onNext();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to send verification code"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-white mb-2">
        {t("forgotPassword.confirmIdentity")}
      </h2>
      <p className="text-gray-400 mb-8">
        {t("forgotPassword.confirmDescription")}
      </p>

      {error && (
        <ErrorMessage
          message={error}
          className="mb-6"
          onRetry={() => setError(null)}
        />
      )}

      <div className="flex items-center gap-4 p-4 rounded-xl bg-[#23232a] mb-8">
        <div className="w-12 h-12 rounded-full bg-[#2a2a32] overflow-hidden flex items-center justify-center shrink-0 relative">
          {user.profilePictureUrl ? (
            <Image
              src={user.profilePictureUrl}
              alt={user.firstName}
              fill
              className="object-cover"
            />
          ) : (
            <Mail className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div>
          <p className="text-white font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-gray-400 text-sm">{email}</p>
        </div>
      </div>

      <button
        onClick={handleRequestReset}
        className="primary-btn flex justify-center items-center w-full"
        disabled={loading}
      >
        {loading ? (
          <LoaderIcon size="24" className="animate-spin text-primary-bg" />
        ) : (
          t("forgotPassword.sendCode")
        )}
      </button>

      <button
        onClick={onBack}
        className="mt-4 text-gray-400 hover:text-white text-sm w-full text-center transition-colors"
      >
        {t("forgotPassword.backToEmail")}
      </button>
    </>
  );
}
