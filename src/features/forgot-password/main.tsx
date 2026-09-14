"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordUser } from "@/features/auth/types/auth";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import VerifyUserForm from "./components/verify-user-form";
import RequestResetForm from "./components/request-reset-form";
import VerifyOtpForm from "./components/verify-otp-form";
import SetNewPasswordForm from "./components/set-new-password-form";

type Step = "verify-email" | "request-reset" | "verify-otp" | "set-password";

export default function ForgotPasswordFeature() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [step, setStep] = useState<Step>("verify-email");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<ForgotPasswordUser | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#191919] relative font-dm-sans">
      <div className="h-[45vh] md:h-[40vh] w-full relative">
        <Image
          src="/login-banner.png"
          alt="Background"
          width={1580}
          height={800}
          className="absolute inset-0 w-full h-full -top-16 object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 items-center z-50 max-w-2xl max-md:rounded-2xl max-md:bg-[#181920] w-full -mt-[20vh] sm:-mt-[18vh] md:-mt-[16vh]">
        <Image
          src="/logo_bright.svg"
          alt="Guọnọ Logo"
          width={200}
          height={56}
          className="object-contain mb-14 -mt-24"
          priority
          unoptimized
        />
        <div className="w-full text-center rounded-2xl bg-[#181920] py-10 px-4 md:px-10 md:shadow-lg">
          {step === "verify-email" && (
            <VerifyUserForm
              onNext={(email, user) => {
                setEmail(email);
                setUser(user);
                setStep("request-reset");
              }}
            />
          )}

          {step === "request-reset" && user && (
            <RequestResetForm
              email={email}
              user={user}
              onNext={() => setStep("verify-otp")}
              onBack={() => setStep("verify-email")}
            />
          )}

          {step === "verify-otp" && (
            <VerifyOtpForm
              email={email}
              userId={user?.userId || user?.id || ""}
              onNext={(token) => {
                setResetToken(token);
                setStep("set-password");
              }}
              onBack={() => setStep("request-reset")}
            />
          )}

          {step === "set-password" && (
            <SetNewPasswordForm email={email} resetToken={resetToken} />
          )}

          <div className="mt-8 pt-6 border-t border-[#2a2a32]">
            <Link
              href="/login"
              className="text-[#F5DEB3] hover:text-[#ffe6b0] text-sm font-medium transition-colors"
            >
              {t("forgotPassword.backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
