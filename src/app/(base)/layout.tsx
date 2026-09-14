"use client";

import { Toaster } from "@/components/ui/sonner";
import Topbar from "@/features/topbar";
import SidebarV2 from "@/features/side-bar";
import AuthGuard from "@/features/auth/components/AuthGuard";
import { useKeyboard } from "@/features/shared/components/keyboard-context";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showKeyboard } = useKeyboard();

  return (
    <AuthGuard>
      <div className={`flex h-screen ${showKeyboard ? "max-md:pb-48" : ""}`}>
        <SidebarV2 />
        <div className="flex flex-1 flex-col">
          <Topbar />
          <Toaster />
          <main className="flex-1 overflow-y-auto bg-[#18191f] custom-scrollbar pt-4">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
