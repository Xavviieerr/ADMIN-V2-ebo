"use client";

import { useState, useCallback } from "react";
import SplashScreen from "@/components/splash-screen";

export default function AppShellSplash({
  children,
}: {
  children: React.ReactNode;
}) {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      {children}
    </>
  );
}
