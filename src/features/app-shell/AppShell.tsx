"use client";

import { Toaster } from "@/components/ui/sonner";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import AuthGuard from "./guards/AuthGuard";

export default function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AuthGuard>
      <div className={className ?? "flex h-screen overflow-x-clip"}>
        <Sidebar />
        <div className="flex flex-1 min-w-0 flex-col">
          <Topbar />
          <Toaster />
          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-clip bg-[#18191f] custom-scrollbar pt-4">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
