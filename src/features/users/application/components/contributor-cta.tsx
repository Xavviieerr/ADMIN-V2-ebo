"use client";

import React, { useState } from "react";
import ApproveContributor from "./approve-contributor";
import { CheckCheck, X } from "lucide-react";
import RejectContributor from "./reject-contributor";

const ContributorCTA = () => {
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  return (
    <>
      <ApproveContributor show={showApprove} setShow={setShowApprove} />
      <RejectContributor show={showReject} setShow={setShowReject} />

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
