"use client";

import PermissionPanel from "./permission-panel";
import { CONTRIBUTOR_PERMISSION_CATEGORIES } from "../../constants";

export default function ContributorPermissions({ userId }: { userId: string }) {
  return (
    <PermissionPanel
      userId={userId}
      categories={CONTRIBUTOR_PERMISSION_CATEGORIES}
    />
  );
}
