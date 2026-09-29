"use client";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  useDeleteSenseAudioMutation,
  useDeleteTranslationAudioMutation,
} from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { ConfirmPopover } from "@/features/dictionary/word-detail/shared";
import {
  DeleteSenseAudioPayload,
  DeleteTranslationAudioPayload,
} from "@/features/dictionary/lib";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const DeleteAudioButton = ({
  type,
  payload,
  size = 18,
}: {
  type: "sense" | "translation";
  payload: DeleteSenseAudioPayload | DeleteTranslationAudioPayload;
  size?: number;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [show, setShow] = useState(false);
  const [deleteSenseAudio, { isLoading: isDeletingSense }] =
    useDeleteSenseAudioMutation();
  const [deleteTranslationAudio, { isLoading: isDeletingTranslation }] =
    useDeleteTranslationAudioMutation();
  const loading = isDeletingSense || isDeletingTranslation;

  const router = useRouter();

  const id = useParams()?.id as string;
  const handleDelete = async () => {
    await runDictionaryMutation({
      run: async () => {
        if (type === "sense") {
          const sensePayload = payload as DeleteSenseAudioPayload;
          await deleteSenseAudio({
            wordId: id,
            senseId: sensePayload.senseId,
            senseIndex: sensePayload.senseIndex,
            url: sensePayload.url,
          }).unwrap();
        }

        if (type === "translation") {
          const translationPayload = payload as DeleteTranslationAudioPayload;
          await deleteTranslationAudio({
            wordId: id,
            translationId: translationPayload.translationId,
            translationIndex: translationPayload.translationIndex,
            languageType: translationPayload.languageType,
            removeUrl: translationPayload.removeUrl,
          }).unwrap();
        }
      },
      successMessage: t("common.dictionary.audioDeleted", "Audio deleted successfully!"),
      errorMessage: t("common.dictionary.failedToDeleteAudio", "Failed to delete audio"),
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
        title={t("common.dictionary.deleteAudio", "Delete Audio")}
        aria-label={t("common.dictionary.deleteAudio", "Delete Audio")}
        className="cursor-pointer font-medium text-base-red flex items-center gap-1"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size} />
        ) : (
          <>
            <Trash2 size={size} />
            <span className="text-xs font-medium">{t("common.delete", "Delete")}</span>
          </>
        )}
      </button>

      <ConfirmPopover
        open={show}
        message={t("common.dictionary.confirmDeleteAudio", "Are you sure you want to delete this audio file?")}
        loading={loading}
        align="left"
        className="top-7"
        onConfirm={handleDelete}
        onCancel={() => setShow(false)}
      />
    </div>
  );
};

export default DeleteAudioButton;
