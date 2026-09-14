"use client";

import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { getErrorMessage } from "@/utils/errorHandler";
import { useApproveAdminMutation } from "@/slice/requestSlice";

const ApproveContributor = ({
  show,
  setShow,
  userId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  userId: string;
}) => {
  const [role, setRole] = useState("");
  const [approveAdmin, { isLoading }] = useApproveAdminMutation();

  if (!show) return null;

  const handleApprove = async () => {
    try {
      await approveAdmin({ userId }).unwrap();
      toast.success("Contributor approved successfully");
      setShow(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to approve contributor"));
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
        <h1 className="font-medium text-2xl">Accept Contributor?</h1>

        <p className="font-medium mb-6 text-gray-txt-50">
          This user will gain contributor access and permissions.
        </p>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="role">Assign Contributor Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            id="role"
            className="input"
          >
            {["admin", "user"].map((role) => (
              <option
                key={role}
                value={role}
                className="text-white bg-secondary-bg"
              >
                {role}
              </option>
            ))}
          </select>
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
            onClick={handleApprove}
            disabled={isLoading}
            className="primary-btn bg-base-green text-white px-10 flex justify-center"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Approve Contributor"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ApproveContributor;
