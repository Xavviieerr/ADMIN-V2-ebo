"use client";

import { SingleWord } from "@/features/dictionary/lib";
import { useApproveWordMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { CheckCheck, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmPopover } from "@/features/dictionary/word-detail/shared";
import { usePermissions } from "@/hooks/usePermissions";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const ApproveWordBtn = ({ data }: { data: SingleWord }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [approveWord, { isLoading: loading }] = useApproveWordMutation();
  const [show, setShow] = useState(false);
  const { currentUser, hasPermission, isSuperAdmin } = usePermissions();
  const userId = currentUser?.id ?? "";

  const canApprove =
    isSuperAdmin || (userId !== data.createdBy.id && hasPermission("add_word"));

  const router = useRouter();

  const handleSubmit = () => {
    runDictionaryMutation({
      run: () => approveWord({ id: data.id }).unwrap(),
      successMessage: t("common.dictionary.wordApproved", "Word approved successfully!"),
      errorMessage: t("common.dictionary.failedToApproveWord", "Failed to approve word"),
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
        className="flex items-center gap-2 primary-btn bg-base-green text-white text-sm"
      >
        {loading ? <Loader2 className="animate-spin" /> : <CheckCheck />}
        <span>{t("common.dictionary.approve", "Approve")}</span>
      </button>

      <ConfirmPopover
        open={show}
        message={t("common.dictionary.confirmApprove", "Are you sure you want to approve this word?")}
        loading={loading}
        tone="success"
        align="right"
        className="top-14 text-start"
        onConfirm={handleSubmit}
        onCancel={() => setShow(false)}
      />
    </div>
  );
};

export default ApproveWordBtn;
