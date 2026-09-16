"use client";

import { AppShell } from "@/features/app-shell";
import { useKeyboard } from "@/features/shared/components/keyboard-context";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showKeyboard } = useKeyboard();

  return (
    <AppShell className={`flex h-screen ${showKeyboard ? "max-md:pb-48" : ""}`}>
      {children}
    </AppShell>
  );
}
