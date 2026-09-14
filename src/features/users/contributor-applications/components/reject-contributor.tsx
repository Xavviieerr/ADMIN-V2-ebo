"use client";

import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";
import { useRejectUserMutation } from "@/slice/requestSlice";

const RejectContributor = ({
  show,
  setShow,
  userId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  userId: string;
}) => {
  const [reason, setReason] = useState("");
  const [rejectUser, { isLoading }] = useRejectUserMutation();

  if (!show) return null;

  const handleReject = async () => {
    if (!reason.trim()) {
      return toast.error("Please provide a reason for rejecting the application");
    }
    try {
      await rejectUser({ userId, rejectionReason: reason.trim() }).unwrap();
      toast.success("Contributor rejected successfully");
      setShow(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reject contributor"));
    }
  };

  return (
    <dialog className="flex justify-center items-center backdrop-blur-sm z-200 overflow-auto no-scrollbar fixed top-0 left-0 w-screen h-screen bg-black/20">
      <div className="flex flex-col items-center max-w-lg w-full bg-gray-txt-100 rounded-lg p-10 gap-2 text-white">
        <Image
          src={"/warning-circle.svg"}
          alt="warning"
          width={80}
          height={80}
        />
        <h1 className="font-medium text-2xl">Reject Contributor?</h1>

        <p className="font-medium mb-6 text-gray-txt-50">
          This user will lose all contributor access and permissions.
        </p>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="reason">Reason for Rejection</label>
          <textarea
            id="reason"
            className="input"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Provide a reason for rejecting this application"
          />
        </div>

        <div className="flex items-center justify-between gap-4 w-full mt-5 font-medium">
          <button
            onClick={() => setShow(false)}
            disabled={isLoading}
            className="secondary-btn px-10"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="primary-btn bg-base-red text-white px-10 flex justify-center"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Reject Contributor"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default RejectContributor;
