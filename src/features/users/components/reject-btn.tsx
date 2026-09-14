"use client";
import { LocaleWrapper } from "@/features/shared";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import RejectUser from "./reject-user";

const RejectBtn = ({ status }: { status: string }) => {
  const [show, setShow] = useState(false);
  const params = useParams();

  const userId = params.userId as string;

  if (status !== "pending") return null;

  return (
    <>
      <RejectUser show={show} setShow={setShow} userId={userId} />
      <button
        onClick={() => setShow(true)}
        className={`px-5 py-3 text-white font-medium text-base rounded-md transition-colors flex items-center gap-2 bg-red-600 hover:bg-red-700`}
      >
        <LocaleWrapper item={"common.rejectUser"} />
      </button>
    </>
  );
};

export default RejectBtn;
