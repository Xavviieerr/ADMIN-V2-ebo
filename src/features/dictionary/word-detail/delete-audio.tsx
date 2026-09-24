"use client";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  useDeleteSenseAudioMutation,
  useDeleteTranslationAudioMutation,
} from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/hooks/runDictionaryMutation";
import { ConfirmPopover } from "@/features/dictionary/shared";
import {
  DeleteSenseAudioPayload,
  DeleteTranslationAudioPayload,
} from "@/features/dictionary/lib";
import { useParams, useRouter } from "next/navigation";

const DeleteAudioButton = ({
  type,
  payload,
  size = 18,
}: {
  type: "sense" | "translation";
  payload: DeleteSenseAudioPayload | DeleteTranslationAudioPayload;
  size?: number;
}) => {
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
      successMessage: "Audio deleted successfully!",
      errorMessage: "Failed to delete audio",
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
        title="Delete Audio"
        className="cursor-pointer font-medium text-base-red"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size} />
        ) : (
          <Trash2 size={size} />
        )}
      </button>

      <ConfirmPopover
        open={show}
        message="Are you sure your want to delete this audio file?"
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
