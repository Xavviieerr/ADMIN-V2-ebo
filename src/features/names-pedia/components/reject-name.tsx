import ModalLayout from "@/features/shared/modal-layout";
import { BASE_URL } from "@/utils/constants";
import { Loader } from "lucide-react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RejectName = ({
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

    const [rejectReason, setRejectReason] = useState("");

    const rejectName = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/names/${nameId}/reject`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ reason: rejectReason }),
            });

            if (!res.ok) {
                throw new Error("Failed to reject name");
            }

            toast.success("Name rejected successfully");
            setShow(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to reject name");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = () => {
        if (rejectReason.trim().length < 3) {
            toast.error("Reason for rejection must be at least 6 characters");
            return;
        }
        rejectName();
    };

    if (!show) return null;
    return (
        <ModalLayout size="2xl">
            <div className="flex flex-col items-center w-full">
                <h1 className="font-semibold md:text-2xl text-xl">Reject Name</h1>
                <p className="font-medium mt-3 text-center max-md:text-sm">
                    Are you sure you want to reject this name? You can&apos;t undo this
                    action.
                </p>

                <div className="mt-5 w-full">
                    <label className="block text-sm font-medium mb-2">Reason</label>
                    <textarea
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="input resize-none w-full"
                        placeholder="Enter reason for rejecting name"
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
                        {loading ? <Loader className="animate-spin" /> : <>Reject <span className="max-md:hidden">Name</span></>}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default RejectName;
