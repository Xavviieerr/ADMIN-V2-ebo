"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { verifyResetOtpAPI, requestResetAPI } from "@/features/auth/services/authService";
import { getErrorMessage } from "@/utils/errorHandler";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { LoaderIcon } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";

interface VerifyOtpFormProps {
  email: string;
  userId: string;
  onNext: (resetToken: string) => void;
  onBack: () => void;
}

export default function VerifyOtpForm({
  email,
  userId,
  onNext,
  onBack,
}: VerifyOtpFormProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const newOtp = pasted.split("").concat(Array(6 - pasted.length).fill(""));
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError(t("forgotPassword.enterOtp"));
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const result = await verifyResetOtpAPI({ email, otp: code });
      if (result.resetToken) {
        onNext(result.resetToken);
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Invalid verification code"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await requestResetAPI({ email, userId });
      setCountdown(60);
      toast.success(t("forgotPassword.sendCode"), {
        description: t("forgotPassword.otpDescription"),
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to resend code"));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-white mb-2">
        {t("forgotPassword.enterOtp")}
      </h2>
      <p className="text-gray-400 mb-8">
        {t("forgotPassword.otpDescription")} <span className="text-white">{email}</span>
      </p>

      {error && (
        <ErrorMessage
          message={error}
          className="mb-6"
          onRetry={() => setError(null)}
        />
      )}

      <div className="flex justify-center gap-3 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl font-semibold text-white bg-[#23232a] border border-[#333] rounded-lg focus:border-[#F5DEB3] focus:outline-none transition-colors"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="primary-btn flex justify-center items-center w-full"
        disabled={loading}
      >
        {loading ? (
          <LoaderIcon size="24" className="animate-spin text-primary-bg" />
        ) : (
          t("forgotPassword.verifyCode")
        )}
      </button>

      <div className="mt-6 text-center">
        {countdown > 0 ? (
          <p className="text-gray-500 text-sm">
            {t("forgotPassword.resendIn")} {countdown}s
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-[#F5DEB3] hover:text-[#ffe6b0] text-sm font-medium transition-colors"
          >
            {resendLoading ? "Sending..." : t("forgotPassword.resendCode")}
          </button>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-4 text-gray-400 hover:text-white text-sm w-full text-center transition-colors"
      >
        {t("common.back")}
      </button>
    </>
  );
}
