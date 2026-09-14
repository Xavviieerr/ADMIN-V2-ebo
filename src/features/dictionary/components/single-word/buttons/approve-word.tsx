"use client";

import { SingleWord } from "@/features/dictionary/lib";
import { approveWord } from "@/features/dictionary/lib/api/update-word";
import { CheckCheck, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";

const ApproveWordBtn = ({ data }: { data: SingleWord }) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { currentUser, hasPermission, isSuperAdmin } = usePermissions();
  const userId = currentUser?.id ?? "";

  const canApprove =
    isSuperAdmin || (userId !== data.createdBy.id && hasPermission("add_word"));

  const token = getAccessToken();
  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);
    approveWord({ id: data.id, token })
      .then((v) => {
        if (v) {
          router.refresh();
        }
      })
      .finally(() => setLoading(false));
  };

  if (data.status.toLowerCase() !== "in-review" || !canApprove) return null;
  return (
    <button
      onClick={() => setShow(!show)}
      disabled={loading}
      className="flex items-center gap-2 primary-btn bg-base-green text-white text-sm relative"
    >
      {loading ? <Loader2 className="animate-spin" /> : <CheckCheck />}
      <span>Approve</span>

      {show && (
        <div className="space-y-2 z-50 px-5 py-2 text-sm absolute top-14 text-start max-md:left-0 md:right-0 w-80 shadow-xl bg-secondary-bg border border-gray-txt-50/50 rounded-xl">
          <p>Are you sure your want to approve this word?</p>
          <div className="flex gap-2 justify-end">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="primary-btn bg-base-green text-white py-2 text-sm"
            >
              {loading ? <Loader2 size={16} /> : "Yes"}
            </button>
            <button
              onClick={() => setShow(false)}
              className="secondary-btn py-2 text-sm"
            >
              No
            </button>
          </div>
        </div>
      )}
    </button>
  );
};

export default ApproveWordBtn;
