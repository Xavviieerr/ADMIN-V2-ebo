"use client";

import React, { useState } from "react";
import { CheckCheck, X, Pause } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  useApproveContributorMutation,
  useRejectContributorMutation,
  useSuspendContributorMutation,
} from "@/slice/requestSlice";
import type { Contributor } from "../../types";
import Image from "next/image";

const SingleContributorCTA = ({
  userData,
  contributor,
}: {
  userData: { id?: string } | null;
  contributor?: Contributor;
}) => {
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");

  const [approveContributor, { isLoading: isApproving }] =
    useApproveContributorMutation();
  const [rejectContributor, { isLoading: isRejecting }] =
    useRejectContributorMutation();
  const [suspendContributor, { isLoading: isSuspending }] =
    useSuspendContributorMutation();

  if (!contributor || !userData?.id) return null;

  const status = contributor.status;

  const handleApprove = async () => {
    try {
      await approveContributor({ contributorId: contributor.id }).unwrap();
      toast.success("Contributor approved successfully");
      setShowApprove(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to approve contributor"));
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      return toast.error("Please provide a reason for rejecting");
    }
    try {
      await rejectContributor({
        contributorId: contributor.id,
        reason: rejectReason.trim(),
      }).unwrap();
      toast.success("Contributor rejected successfully");
      setShowReject(false);
      setRejectReason("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reject contributor"));
    }
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      return toast.error("Please provide a reason for suspension");
    }
    try {
      await suspendContributor({
        contributorId: contributor.id,
        reason: suspendReason.trim(),
      }).unwrap();
      toast.success("Contributor suspended successfully");
      setShowSuspend(false);
      setSuspendReason("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to suspend contributor"));
    }
  };

  if (status === "pending") {
    return (
      <>
        {showReject && (
          <dialog className="flex justify-center items-center backdrop-blur-sm z-200 overflow-auto no-scrollbar fixed top-0 left-0 w-screen h-screen bg-black/20">
            <div className="flex flex-col items-center max-w-lg w-full bg-gray-txt-100 rounded-lg p-6 sm:p-10 gap-2 text-white mx-4">
              <Image
                src={"/warning-circle.svg"}
                alt="warning"
                width={80}
                height={80}
              />
              <h1 className="font-medium text-xl sm:text-2xl">Reject Contributor?</h1>
              <p className="font-medium mb-4 sm:mb-6 text-gray-txt-50 text-center">
                This user will not gain contributor access.
              </p>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="reject-reason">Reason for Rejection</label>
                <textarea
                  id="reject-reason"
                  className="input"
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide a reason for rejecting this application"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 w-full mt-4 sm:mt-5 font-medium">
                <button
                  onClick={() => {
                    setShowReject(false);
                    setRejectReason("");
                  }}
                  disabled={isRejecting}
                  className="secondary-btn px-10 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="primary-btn bg-base-red text-white px-10 flex justify-center w-full sm:w-auto"
                >
                  {isRejecting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Reject Contributor"
                  )}
                </button>
              </div>
            </div>
          </dialog>
        )}

        {showApprove && (
          <dialog className="flex justify-center items-center backdrop-blur-sm z-200 overflow-auto no-scrollbar fixed top-0 left-0 w-screen h-screen bg-black/20">
            <div className="flex flex-col items-center max-w-lg w-full bg-gray-txt-100 rounded-lg p-6 sm:p-10 gap-2 text-white mx-4">
              <Image
                src={"/warning-circle.svg"}
                alt="warning"
                width={80}
                height={80}
              />
              <h1 className="font-medium text-xl sm:text-2xl">Accept Contributor?</h1>
              <p className="font-medium mb-4 sm:mb-6 text-gray-txt-50 text-center">
                This user will gain contributor access and permissions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 w-full mt-4 sm:mt-5 font-medium">
                <button
                  onClick={() => setShowApprove(false)}
                  disabled={isApproving}
                  className="secondary-btn px-10 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="primary-btn bg-base-green text-white px-10 flex justify-center w-full sm:w-auto"
                >
                  {isApproving ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Approve Contributor"
                  )}
                </button>
              </div>
            </div>
          </dialog>
        )}

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={() => setShowReject(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-base-red cursor-pointer font-medium text-sm sm:text-base rounded-md transition-colors"
          >
            <X size={18} />
            Reject
          </button>
          <button
            onClick={() => setShowApprove(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-green-600 text-white cursor-pointer font-medium text-sm sm:text-base rounded-md transition-colors"
          >
            <CheckCheck size={18} />
            Approve
          </button>
        </div>
      </>
    );
  }

  if (status === "approved") {
    return (
      <>
        {showSuspend && (
          <dialog className="flex justify-center items-center backdrop-blur-sm z-200 overflow-auto no-scrollbar fixed top-0 left-0 w-screen h-screen bg-black/20">
            <div className="flex flex-col items-center max-w-lg w-full bg-gray-txt-100 rounded-lg p-6 sm:p-10 gap-2 text-white mx-4">
              <Image
                src={"/warning-circle.svg"}
                alt="warning"
                width={80}
                height={80}
              />
              <h1 className="font-medium text-xl sm:text-2xl">Suspend as Contributor?</h1>
              <p className="font-medium mb-4 sm:mb-6 text-gray-txt-50 text-center">
                This contributor will lose their contributor access.
              </p>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="suspend-reason">Reason for Suspension</label>
                <textarea
                  id="suspend-reason"
                  className="input"
                  rows={4}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Provide a reason for suspending this contributor"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 w-full mt-4 sm:mt-5 font-medium">
                <button
                  onClick={() => {
                    setShowSuspend(false);
                    setSuspendReason("");
                  }}
                  disabled={isSuspending}
                  className="secondary-btn px-10 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspend}
                  disabled={isSuspending}
                  className="primary-btn bg-yellow-500 text-white px-10 flex justify-center w-full sm:w-auto"
                >
                  {isSuspending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Suspend as Contributor"
                  )}
                </button>
              </div>
            </div>
          </dialog>
        )}

        <button
          onClick={() => setShowSuspend(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-yellow-500 cursor-pointer font-medium text-sm sm:text-base rounded-md transition-colors"
        >
          <Pause size={18} />
          Suspend as Contributor
        </button>
      </>
    );
  }

  return null;
};

export default SingleContributorCTA;
