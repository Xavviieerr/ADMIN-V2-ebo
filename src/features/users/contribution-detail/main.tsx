"use client";

import React, { useState } from "react";
import { GoBackButton } from "@/features/shared";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocale } from "@/contexts/LocaleContext";
import { toast } from "sonner";
import { CheckCheck, X } from "lucide-react";
import Image from "next/image";

const ContributionDetailFeature = ({
  userId,
  contributionId,
}: {
  userId: string;
  contributionId: string;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [actionTaken, setActionTaken] = useState<"approved" | "rejected" | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const handleApprove = () => {
    setActionTaken("approved");
    setShowApproveModal(false);
    toast.success("Contribution approved successfully");
  };

  const handleReject = () => {
    setActionTaken("rejected");
    setShowRejectModal(false);
    toast.success("Contribution rejected successfully");
  };

  return (
    <div className="min-h-screen p-4 md:p-6 text-white">
      <GoBackButton link={`/users/${userId}?role=contributor`} />

      <div className="rounded-xl px-6 md:p-8 mb-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">
            {t("common.contributionDetail", "Contribution Detail")}
          </h1>

          {!actionTaken && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-white text-base-red cursor-pointer font-medium text-base rounded-md transition-colors"
              >
                <X size={18} />
                {t("common.reject", "Reject")}
              </button>
              <button
                onClick={() => setShowApproveModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white cursor-pointer font-medium text-base rounded-md transition-colors"
              >
                <CheckCheck size={18} />
                {t("common.accept", "Accept")}
              </button>
            </div>
          )}

          {actionTaken && (
            <div
              className={`px-4 py-2 rounded-md font-medium ${
                actionTaken === "approved"
                  ? "bg-green-400/10 text-green-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {actionTaken === "approved"
                ? t("common.approved", "Approved")
                : t("common.rejected", "Rejected")}
            </div>
          )}
        </div>

        <div className="bg-[#1E1E1E] rounded-lg p-6">
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">
              {t(
                "common.contributionDetailsComingSoon",
                "Contribution details will be available once the contributions endpoint is implemented.",
              )}
            </p>
            <p className="text-sm mt-2">
              {t("common.contributionId", "Contribution ID")}: {contributionId}
            </p>
          </div>
        </div>
      </div>

      {showApproveModal && (
        <dialog className="flex justify-center items-center backdrop-blur-sm z-200 overflow-auto no-scrollbar fixed top-0 left-0 w-screen h-screen bg-black/20">
          <div className="flex flex-col items-center max-w-lg w-full bg-gray-txt-100 rounded-lg p-10 gap-2 text-white">
            <Image
              src={"/warning-circle.svg"}
              alt="warning"
              width={80}
              height={80}
            />
            <h1 className="font-medium text-2xl">Accept Contribution?</h1>
            <p className="font-medium mb-6 text-gray-txt-50">
              This contribution will be marked as approved.
            </p>
            <div className="flex items-center justify-between gap-4 w-full mt-5 font-medium">
              <button
                onClick={() => setShowApproveModal(false)}
                className="secondary-btn px-10"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="primary-btn bg-base-green text-white px-10 flex justify-center"
              >
                Accept Contribution
              </button>
            </div>
          </div>
        </dialog>
      )}

      {showRejectModal && (
        <dialog className="flex justify-center items-center backdrop-blur-sm z-200 overflow-auto no-scrollbar fixed top-0 left-0 w-screen h-screen bg-black/20">
          <div className="flex flex-col items-center max-w-lg w-full bg-gray-txt-100 rounded-lg p-10 gap-2 text-white">
            <Image
              src={"/warning-circle.svg"}
              alt="warning"
              width={80}
              height={80}
            />
            <h1 className="font-medium text-2xl">Reject Contribution?</h1>
            <p className="font-medium mb-6 text-gray-txt-50">
              This contribution will be marked as rejected.
            </p>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="contribution-reject-reason">
                Reason for Rejection
              </label>
              <textarea
                id="contribution-reject-reason"
                className="input"
                rows={4}
                placeholder="Provide a reason for rejecting this contribution"
              />
            </div>
            <div className="flex items-center justify-between gap-4 w-full mt-5 font-medium">
              <button
                onClick={() => setShowRejectModal(false)}
                className="secondary-btn px-10"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="primary-btn bg-base-red text-white px-10 flex justify-center"
              >
                Reject Contribution
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ContributionDetailFeature;
