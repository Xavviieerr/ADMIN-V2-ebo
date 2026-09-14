"use client";
import { LocaleWrapper } from "@/features/shared";
import React, { useState } from "react";
import SuspendUser from "./suspend-user";
import { useParams } from "next/navigation";

const SuspendBtn = ({ status }: { status: string }) => {
  const [show, setShow] = useState(false);
  const params = useParams();

  const userId = params.userId as string;

  if (status == "pending" || status == "rejected" || status == "deleted")
    return null;

  return (
    <>
      <SuspendUser
        show={show}
        setShow={setShow}
        isSuspended={status == "suspended"}
        userId={userId}
      />
      <button
        onClick={() => setShow(true)}
        className={`px-5 py-3 text-white font-medium text-base rounded-md transition-colors flex items-center gap-2 ${
          status == "suspended"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        <LocaleWrapper
          item={
            status == "suspended"
              ? "common.removeSuspension"
              : "common.suspendUser"
          }
        />
      </button>
    </>
  );
};

export default SuspendBtn;
