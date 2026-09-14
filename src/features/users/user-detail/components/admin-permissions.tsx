"use client";

import PermissionPanel from "./permission-panel";
import { ADMIN_PERMISSION_CATEGORIES } from "../../constants";

export default function AdminPermissions({ userId }: { userId: string }) {
  return <PermissionPanel userId={userId} categories={ADMIN_PERMISSION_CATEGORIES} />;
}
