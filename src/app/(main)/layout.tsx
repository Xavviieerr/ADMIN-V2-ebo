"use client";

import Topbar from "@/features/topbar";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import SidebarV2 from "@/features/side-bar";
import AuthGuard from "@/features/auth/components/AuthGuard";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AuthGuard>
        <div className="flex h-screen">
          <SidebarV2 />
          <div className="flex flex-1 flex-col">
            <Topbar />
            <Toaster />
            <main className="flex-1 overflow-y-auto bg-[#18191f]">
              {children}
            </main>
          </div>
        </div>
      </AuthGuard>
    </Providers>
  );
}
