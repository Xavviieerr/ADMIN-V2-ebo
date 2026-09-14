import { PermissionGate } from "@/features/shared";
import { getUserStatus } from "@/helpers";
import React from "react";
import { SuspendBtn } from "@/features/users/components";

const SingleUserCTA = ({ userData }: { userData: any }) => {
  if (!userData) return null;

  const status = getUserStatus(userData);
  return (
    <PermissionGate permission="edit_user">
      <SuspendBtn status={status} />
    </PermissionGate>
  );
};

export default SingleUserCTA;
