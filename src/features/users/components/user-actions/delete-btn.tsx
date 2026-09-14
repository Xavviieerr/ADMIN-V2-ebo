"use client";
import { LocaleWrapper, PermissionGate } from "@/features/shared";
import React, { useState } from "react";
import { useParamUserId } from "../../hooks/useParamUserId";
import DeleteUser from "./delete-user";

const DeleteBtn = ({ status }: { status: string }) => {
  const [show, setShow] = useState(false);
  const userId = useParamUserId();

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

export default DeleteBtn;
