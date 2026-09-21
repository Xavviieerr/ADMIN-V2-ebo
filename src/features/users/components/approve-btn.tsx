"use client";

import { LocaleWrapper } from "@/features/shared";
import { BASE_URL } from "@/utils/constants";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const ApproveBtn = ({ status }: { status: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const userId = params.userId as string;
  const token = getAccessToken();

  if (status !== "pending") return null;

  const approveAdmin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/approve/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to approve admin");
      }

      const data = await res.json();
      toast.success("Admin approved successfully");
      router.refresh();
      return data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve admin");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    approveAdmin();
  };

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium text-base rounded-md transition-colors flex items-center gap-2"
    >
      {loading ? (
        <Loader className="animate-spin" />
      ) : (
        <LocaleWrapper item="common.approveUser" />
      )}
    </button>
  );
};

export default ApproveBtn;
