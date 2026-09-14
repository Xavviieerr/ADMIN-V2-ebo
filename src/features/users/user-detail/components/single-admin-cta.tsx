"use client";

import { PermissionGate } from "@/features/shared";
import type { AdminData } from "../../types";
import { getUserStatus } from "../../utils/getUserStatus";
import { ApproveBtn, RejectBtn, SuspendBtn } from "@/features/users/components";

const SingleAdminCTA = ({
  adminData,
}: {
  adminData: AdminData | null;
}) => {
  if (!adminData || !adminData.user) return null;

  const status = getUserStatus(adminData.user);

  if (status === "deleted" || status === "rejected") return null;

  return (
    <PermissionGate permission="edit_user">
      <ApproveBtn status={status} />

      <RejectBtn status={status} />

      <SuspendBtn status={status} />
    </PermissionGate>
  );
};

export default SingleAdminCTA;
