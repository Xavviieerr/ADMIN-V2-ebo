"use client";
import { LocaleWrapper, PermissionGate } from "@/features/shared";
import React, { useState } from "react";
import SuspendUser from "./suspend-user";
import { useParams } from "next/navigation";
import DeleteUser from "./delete-user";

const SuspendBtn = ({ status }: { status: string }) => {
  const [show, setShow] = useState(false);
  const params = useParams();

  const userId = params.userId as string;

  if (status === "deleted") return null;

  return (
    <>
      <DeleteUser show={show} setShow={setShow} userId={userId} />
      <PermissionGate permission="delete_user">
        <button
          onClick={() => setShow(true)}
          className={`px-5 py-3 font-medium text-base rounded-md transition-colors flex items-center gap-2 bg-white text-base-red`}
        >
          <LocaleWrapper item={"common.deleteUser"} />
        </button>
      </PermissionGate>
    </>
  );
};

export default SuspendBtn;
