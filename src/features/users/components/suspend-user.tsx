"use client";

import ModalLayout from "@/features/shared/modal-layout";
import { BASE_URL } from "@/utils/constants";
import { Loader } from "lucide-react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SuspendUser = ({
  show,
  setShow,
  isSuspended,
  userId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  isSuspended: boolean;
  userId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getAccessToken();

  const [suspensionReason, setSuspensionReason] = useState("");

  const suspendUser = async () => {
    if (!isSuspended && !suspensionReason.trim()) {
      return toast.error("Please provide a reason for suspending the user");
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/users/restrict/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ suspensionReason }),
      });

      if (!res.ok) {
        throw new Error("Failed to suspend user");
      }

      const data = await res.json();
      toast.success(
        isSuspended
          ? "User suspension removed successfully"
          : "User suspended successfully",
      );
      setShow(false);
      router.refresh();
      return data;
    } catch (error) {
      toast.error("Failed to suspend user");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const handleSuspend = () => {
    suspendUser();
  };

  if (!show) return null;

  if (isSuspended) {
    return (
      <ModalLayout size="2xl">
        <div className="flex flex-col items-center w-full">
          <h1 className="font-semibold md:text-2xl text-xl mb-5">
            Remove User Suspension
          </h1>

          <Image
            src={"/warning-circle.svg"}
            alt="warning"
            width={100}
            height={100}
            className="w-25 h-25 max-md:w-18 max-md:h-18"
          />

          <p className="font-medium mt-2 text-center max-md:text-sm">
            Are you sure you want to remove this user's suspension?
          </p>

          <div className="flex items-center gap-4 w-full mt-10 font-medium">
            <button
              onClick={() => setShow(false)}
              className="secondary-btn w-full"
            >
              Cancel
            </button>
            <button
              onClick={handleSuspend}
              className={`primary-btn w-full flex justify-center text-white ${isSuspended ? "bg-green-600 hover:bg-green-700" : "bg-base-red hover:bg-red-700"}`}
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <p>
                  <span className="md:hidden">Submit</span>

                  <span className="max-md:hidden">Remove Suspension</span>
                </p>
              )}
            </button>
          </div>
        </div>
      </ModalLayout>
    );
  }
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full">
        <h1 className="font-semibold md:text-2xl text-xl">Suspend User</h1>
        <p className="font-medium mt-3 text-center max-md:text-sm">
          Are you sure you want to supend this user? Enter the reason below.
        </p>

        <div className="mt-5 w-full">
          <label className="block text-sm font-medium mb-2">Reason</label>
          <textarea
            rows={4}
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
            className="input resize-none w-full"
            placeholder="Enter reason for suspending user"
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
            onClick={handleSuspend}
            className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <p>
                Suspend <span className="max-md:hidden">User</span>
              </p>
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default SuspendUser;
