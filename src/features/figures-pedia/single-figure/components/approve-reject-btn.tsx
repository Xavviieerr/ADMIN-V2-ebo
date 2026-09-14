"use client";

import { CheckCheck, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { approveFigure, Figure, rejectFigure } from "../../lib";
import ModalLayout from "@/features/shared/modal-layout";
import { BaseTextArea } from "@/features/shared";

const ApproveRejectBtn = ({ data }: { data: Figure }) => {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const token = getAccessToken();

  const handleApprove = () => {
    setApproving(true);
    approveFigure({ id: data.id, token })
      .then((v) => {
        if (v) {
          router.refresh();
        }
      })
      .finally(() => setApproving(false));
  };

  const handleReject = () => {
    setRejecting(true);
    rejectFigure({ id: data.id, token, payload: { reason: rejectionReason } })
      .then((v) => {
        if (v) {
          router.refresh();
        }
      })
      .finally(() => {
        setRejecting(false);
        setShowModal(false);
      });
  };

  if (data.status != "pending") return null;
  return (
    <>
      <button
        disabled={approving}
        onClick={handleApprove}
        className="flex items-center justify-center primary-btn gap-2 bg-green-600 text-white"
      >
        {approving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <CheckCheck size={18} className="max-md:hidden" />
            Approve
          </>
        )}
      </button>

      <button
        disabled={rejecting}
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 secondary-btn text-base-red bg-white border-transparent"
      >
        {rejecting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <XCircle size={18} className="max-md:hidden" />
            Reject
          </>
        )}
      </button>

      {showModal && (
        <ModalLayout size="2xl">
          <div className="flex flex-col items-center w-full">
            <h1 className="font-semibold md:text-2xl text-xl">Reject Word</h1>
            <p className="font-medium mt-3 text-center max-md:text-sm">
              Are you sure you want to reject this figure?
            </p>

            <div className="mt-5 w-full">
              <BaseTextArea
                rows={4}
                value={rejectionReason}
                setValue={(e) => setRejectionReason(e as string)}
                styling=" resize-none w-full"
                placeholder="Enter reason for rejecting word"
              ></BaseTextArea>
            </div>

            <div className="flex items-center gap-4 w-full mt-5 font-medium">
              <button
                onClick={() => setShowModal(false)}
                className="secondary-btn w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center"
                disabled={rejecting}
              >
                {rejecting ? <Loader2 className="animate-spin" /> : "Reject"}
              </button>
            </div>
          </div>
        </ModalLayout>
      )}
    </>
  );
};

export default ApproveRejectBtn;
