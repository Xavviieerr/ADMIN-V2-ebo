"use client";
import { SingleWord } from "@/features/dictionary/lib";
import { Loader, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useRejectWordMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import ModalLayout from "@/features/shared/modal-layout";
import { usePermissions } from "@/hooks/usePermissions";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const RejectWordBtn = ({ data }: { data: SingleWord }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [rejectWord, { isLoading: loading }] = useRejectWordMutation();
  const [show, setShow] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { currentUser, hasPermission, isSuperAdmin } = usePermissions();
  const userId = currentUser?.id ?? "";

  const canApprove =
    isSuperAdmin || (userId !== data.createdBy.id && hasPermission("add_word"));

  const router = useRouter();

  const handleSubmit = () => {
    runDictionaryMutation({
      run: () => rejectWord({ id: data.id, reason: rejectionReason }).unwrap(),
      successMessage: t("common.dictionary.wordRejected", "Word rejected successfully!"),
      errorMessage: t("common.dictionary.failedToRejectWord", "Failed to reject word"),
      onSuccess: () => {
        setShow(false);
        router.refresh();
      },
    });
  };

  if (data.status.toLowerCase() !== "in-review" || !canApprove) return null;

  return (
    <div className="w-fit relative">
      <button
        onClick={() => setShow(!show)}
        disabled={loading}
        className="flex items-center gap-2 primary-btn bg-white text-base-red text-sm"
      >
        {loading ? <Loader2 className="animate-spin" /> : <XCircle />}
        <span>{t("common.dictionary.reject", "Reject")}</span>
      </button>

      {show && (
        <ModalLayout size="2xl">
          <div className="flex flex-col items-center w-full">
            <h1 className="font-semibold md:text-2xl text-xl">{t("common.dictionary.rejectWord", "Reject Word")}</h1>
            <p className="font-medium mt-3 text-center max-md:text-sm">
              {t("common.dictionary.confirmRejectWord", "Are you sure you want to reject this word?")}
            </p>

            <div className="mt-5 w-full flex flex-col gap-2">
              <label htmlFor="reject-reason" className="text-sm text-left w-full">
                {t("common.dictionary.rejectReasonLabel", "Reason for rejection")}
              </label>
              <textarea
                id="reject-reason"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="input resize-none w-full"
                placeholder={t("common.dictionary.rejectReasonPlaceholder", "Enter reason for rejecting word")}
              ></textarea>
            </div>

            <div className="flex items-center gap-4 w-full mt-5 font-medium">
              <button
                onClick={() => setShow(false)}
                className="secondary-btn w-full"
              >
                {t("common.cancel", "Cancel")}
              </button>
              <button
                onClick={handleSubmit}
                className="primary-btn bg-base-red hover:bg-red-700 text-white w-full flex justify-center"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : t("common.dictionary.reject", "Reject")}
              </button>
            </div>
          </div>
        </ModalLayout>
      )}
    </div>
  );
};

export default RejectWordBtn;
