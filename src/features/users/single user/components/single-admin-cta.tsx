"use client";

import { PermissionGate } from "@/features/shared";
import { getUserStatus } from "@/helpers";
import { ApproveBtn, RejectBtn, SuspendBtn } from "../../components";

const SingleAdminCTA = ({ adminData }: { adminData: any }) => {
  if (!adminData || !adminData.user) return null;

  const status = getUserStatus(adminData.user);

  if (status == "deleted" || status == "rejected") return null;

  return (
    <PermissionGate permission="edit_user">
      <ApproveBtn status={status} />

      <RejectBtn status={status} />

      <SuspendBtn status={status} />
    </PermissionGate>
  );
};

export default SingleAdminCTA;
