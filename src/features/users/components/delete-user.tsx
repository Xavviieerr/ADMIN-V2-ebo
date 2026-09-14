"use client";

import ModalLayout from "@/features/shared/modal-layout";
import { BASE_URL } from "@/utils/constants";
import { Loader } from "lucide-react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DeleteUser = ({
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

  const deleteUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      const data = await res.json();
      toast.success("User deleted successfully");
      setShow(false);
      router.replace("/users");
      return data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    deleteUser();
  };

  if (!show) return null;
  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full">
        <h1 className="font-semibold text-2xl mb-5">Delete User</h1>

        <Image
          src={"/warning-circle.svg"}
          alt="warning"
          width={100}
          height={100}
          className="w-25 h-25 max-md:w-18 max-md:h-18"
        />

        <p className="font-medium mt-3">
          Are you sure you want to delete this user? You can&apos;t undo this
          action.
        </p>

        <div className="flex items-center gap-4 w-full mt-5 font-medium">
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
            {loading ? <Loader className="animate-spin" /> : "Delete User"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default DeleteUser;
