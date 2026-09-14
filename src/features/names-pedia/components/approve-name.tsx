import ModalLayout from "@/features/shared/modal-layout";
import { BASE_URL } from "@/utils/constants";
import { CheckCheck, Loader } from "lucide-react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ApproveName = ({
  show,
  setShow,
  nameId,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
  nameId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getAccessToken();

  const approveName = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/names/${nameId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to approve user");
      }

      toast.success("Name approved successfully");
      setShow(false);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve name");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    approveName();
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full gap-6">
        <h1 className="font-medium md:text-2xl text-xl">Approve This Name</h1>

        <CheckCheck size={72} className="text-gray-txt-50 max-md:hidden" />
        <CheckCheck size={52} className="text-gray-txt-50 md:hidden" />

        <p className="font-medium text-center max-md:text-sm">
          Are you sure you want to approve this name? Kindly confirm before
          proceeding.
        </p>

        <div className="flex items-center gap-4 w-full font-medium">
          <button
            onClick={() => setShow(false)}
            className="secondary-btn w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            className="primary-btn bg-base-green text-white w-full flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                Approve <span className="max-md:hidden">Name</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ApproveName;
