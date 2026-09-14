"use client";

import { usePermissions } from "@/hooks/usePermissions";

export default function PermissionGate({
  children,
  permission,
}: {
  children: React.ReactNode;
  permission?: string;
}) {
  const { isSuperAdmin, hasPermission } = usePermissions();

  if (!isSuperAdmin && permission && !hasPermission(permission)) return null;

  return <>{children}</>;
}
