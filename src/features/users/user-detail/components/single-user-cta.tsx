import { PermissionGate } from "@/features/shared";
import type { UserData } from "../../types";
import { getUserStatus } from "../../utils/getUserStatus";
import React from "react";
import { SuspendBtn } from "@/features/users/components";

const SingleUserCTA = ({
  userData,
}: {
  userData: UserData | null;
}) => {
  if (!userData) return null;

  const status = getUserStatus(userData);
  return (
    <PermissionGate permission="edit_user">
      <SuspendBtn status={status} />
    </PermissionGate>
  );
};

export default SingleUserCTA;
