"use client";

import React, { useState } from "react";
import { CheckCheck, X } from "lucide-react";
import { useParamUserId } from "@/features/users/hooks/useParamUserId";
import ApproveContributor from "./approve-contributor";
import RejectContributor from "./reject-contributor";

const ContributorCTA = () => {
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const userId = useParamUserId();
  return (
    <>
      <ApproveContributor show={showApprove} setShow={setShowApprove} userId={userId} />
      <RejectContributor show={showReject} setShow={setShowReject} userId={userId} />

      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowReject(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white text-base-red cursor-pointer font-medium text-base rounded-md transition-colors"
        >
          <X size={18} />
          Reject
        </button>
        <button
          onClick={() => setShowApprove(true)}
          className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white cursor-pointer font-medium text-base rounded-md transition-colors"
        >
          <CheckCheck size={18} />
          Approve
        </button>
      </div>
    </>
  );
};

export default ContributorCTA;
