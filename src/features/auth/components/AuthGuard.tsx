"use client";

import { useAppSelector } from "@/hooks/redux-hooks";
import { selectAccessToken } from "@/features/auth/store/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const accessToken = useAppSelector(selectAccessToken);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router, hydrated]);

  if (!hydrated || !accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18191f]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
