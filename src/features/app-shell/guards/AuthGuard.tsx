"use client";

import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  // Cookies are the single source of truth for authentication.
  // A valid cookie must never cause a redirect to /login just because
  // Redux state is empty (e.g. failed rehydration, cleared localStorage).
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    setHasToken(tokenStorage.getAccessToken() !== null);
  }, []);

  useEffect(() => {
    if (hasToken === false) {
      router.replace("/login");
    }
  }, [hasToken, router]);

  if (hasToken !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18191f]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
