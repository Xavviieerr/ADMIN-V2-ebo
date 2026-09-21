import ModalLayout from "@/features/shared/modal-layout";
import { BASE_URL } from "@/utils/constants";
import { Loader } from "lucide-react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RejectUser = ({
  show,
  setShow,
  userId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  userId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getAccessToken();

  const [rejectionReason, setRejectionReason] = useState("");

  const rejectUser = async () => {
    if (!rejectionReason.trim()) {
      return toast.error("Please provide a reason for rejecting the user");
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/reject/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason }),
      });

      if (!res.ok) {
        throw new Error("Failed to reject user");
      }

      const data = await res.json();
      toast.success("User rejected successfully");
      setShow(false);
      router.refresh();
      return data;
    } catch (_error) {
      toast.error("Failed to reject user");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const handleReject = () => {
    rejectUser();
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full">
        <h1 className="font-semibold md:text-2xl text-xl">Reject User</h1>
        <p className="font-medium mt-3 text-center max-md:text-sm">
          Are you sure you want to reject this user? Enter the reason below.
        </p>

        <div className="mt-5 w-full">
          <label className="block text-sm font-medium mb-2">Reason</label>
          <textarea
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="input resize-none w-full"
            placeholder="Enter reason for rejecting user"
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
            onClick={handleReject}
            className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <p>
                Reject <span className="max-md:hidden">User</span>
              </p>
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default RejectUser;
