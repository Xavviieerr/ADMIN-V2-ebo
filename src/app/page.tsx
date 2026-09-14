"use client";

import { useAppSelector } from '@/hooks/redux-hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { selectAccessToken } from '@/features/auth/store/authSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Page() {
  const accessToken = useAppSelector(selectAccessToken);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      if (accessToken) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [accessToken, router, hydrated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191919]">
      <div className="text-white">
        <LoadingSpinner />
      </div>
    </div>
  );
}
