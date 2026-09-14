"use client";
import { SingleWord } from "@/features/dictionary/lib";
import { Loader, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { rejectWord } from "@/features/dictionary/lib/api/update-word";
import ModalLayout from "@/features/shared/modal-layout";
import { usePermissions } from "@/hooks/usePermissions";

const RejectWordBtn = ({ data }: { data: SingleWord }) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { currentUser, hasPermission, isSuperAdmin } = usePermissions();
  const userId = currentUser?.id ?? "";

  const canApprove =
    isSuperAdmin || (userId !== data.createdBy.id && hasPermission("add_word"));

  const token = getAccessToken();
  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);
    rejectWord({ id: data.id, token, payload: { rejectionReason } })
      .then((v) => {
        if (v) {
          router.refresh();
        }
      })
      .finally(() => setLoading(false));
  };

  if (data.status.toLowerCase() !== "in-review" || !canApprove) return null;

  return (
    <div className="w-fit relative">
      <button
        onClick={() => setShow(!show)}
        disabled={loading}
        className="flex items-center gap-2 primary-btn bg-white text-base-red text-sm"
      >
        {loading ? <Loader2 className="animate-spin" /> : <XCircle />}
        <span>Reject</span>
      </button>

      {show && (
        <ModalLayout size="2xl">
          <div className="flex flex-col items-center w-full">
            <h1 className="font-semibold md:text-2xl text-xl">Reject Word</h1>
            <p className="font-medium mt-3 text-center max-md:text-sm">
              Are you sure you want to reject this word?
            </p>

            <div className="mt-5 w-full">
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="input resize-none w-full"
                placeholder="Enter reason for rejecting word"
              ></textarea>
            </div>

            <div className="flex items-center gap-4 w-full mt-5 font-medium">
              <button
                onClick={() => setShow(false)}
                className="secondary-btn w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : "Reject"}
              </button>
            </div>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default RejectWordBtn;
