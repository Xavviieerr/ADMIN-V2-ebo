import ModalLayout from "@/features/shared/modal-layout";
import { BASE_URL } from "@/utils/constants";
import { Info, Loader } from "lucide-react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DeleteName = ({
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

    const deleteName = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/names/${nameId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to delete user");
            }

            toast.success("Name deleted successfully");
            setShow(false);
            router.push("/guonopedia/names");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete name");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        deleteName();
    };

    if (!show) return null;
    return (
        <ModalLayout size="2xl">
            <div className="flex flex-col items-center w-full gap-6">
                <h1 className="font-medium md:text-2xl text-xl">Delete This Name</h1>

                <Image src={"/warning-circle.svg"} alt="warning" width={100} height={100} className="w-25 h-25 max-md:w-18 max-md:h-18" />

                <p className="font-medium text-center max-md:text-sm">
                    Are you sure you want to delete this name? You can&apos;t undo this
                    action.
                </p>

                <div className="flex items-center gap-4 w-full font-medium">
                    <button
                        onClick={() => setShow(false)}
                        className="secondary-btn w-full"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center"
                        disabled={loading}
                    >
                        {loading ? <Loader className="animate-spin" /> : <>Delete <span className="max-md:hidden">Name</span></>}
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
};

export default DeleteName;
