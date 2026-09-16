"use client";

import { AppShell } from "@/features/app-shell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
