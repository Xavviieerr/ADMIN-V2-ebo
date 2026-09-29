"use client";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeleteSenseMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { ConfirmPopover } from "@/features/dictionary/word-detail/shared";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const DeleteSenseButton = ({
  payload,
  size = 18,
}: {
  payload: { senseId: string; senseIndex: number };
  size?: number;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [show, setShow] = useState(false);
  const [deleteSense, { isLoading: loading }] = useDeleteSenseMutation();

  const router = useRouter();

  const id = useParams()?.id as string;
  const handleDelete = async () => {
    await runDictionaryMutation({
      run: () =>
        deleteSense({
          wordId: id,
          senseId: payload.senseId,
          senseIndex: payload.senseIndex,
        }).unwrap(),
      successMessage: t("common.dictionary.senseDeleted", "Word Sense deleted successfully"),
      errorMessage: t("common.dictionary.failedToDeleteSense", "Failed to delete sense"),
      onSuccess: () => {
        router.refresh();
      },
    });
    setShow(false);
  };

  return (
    <div className="w-fit relative">
      <button
        onClick={() => setShow(!show)}
        type="button"
        disabled={loading}
        title={t("common.dictionary.deleteSense", "Delete Sense")}
        className="cursor-pointer font-medium bg-base-red text-white py-2 px-8 text-sm rounded-md border border-base-red"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size} />
        ) : (
          <span>{t("common.delete", "Delete")}</span>
        )}
      </button>

      <ConfirmPopover
        open={show}
        message={t("common.dictionary.confirmDeleteSense", "Are you sure you want to delete this sense?")}
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setShow(false)}
      />
    </div>
  );
};

export default DeleteSenseButton;
