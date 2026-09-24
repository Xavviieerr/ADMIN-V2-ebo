"use client";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeleteTranslationMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/hooks/runDictionaryMutation";
import { ConfirmPopover } from "@/features/dictionary/shared";

const DeleteTranslationButton = ({
  payload,
  size = 18,
}: {
  payload: {
    translationId: string;
    translationIndex: number;
    languageType: string;
  };
  size?: number;
}) => {
  const [show, setShow] = useState(false);
  const [deleteTranslation, { isLoading: loading }] =
    useDeleteTranslationMutation();

  const router = useRouter();

  const id = useParams()?.id as string;
  const handleDelete = async () => {
    await runDictionaryMutation({
      run: () =>
        deleteTranslation({
          wordId: id,
          translationId: payload.translationId,
          translationIndex: payload.translationIndex,
          languageType: payload.languageType,
        }).unwrap(),
      successMessage: "Word translation deleted successfully!",
      errorMessage: "Failed to delete translation",
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
        title="Delete Translation"
        className="cursor-pointer font-medium text-base-red px-2"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size} />
        ) : (
          <Trash2 size={size} />
        )}
      </button>

      <ConfirmPopover
        open={show}
        message="Are you sure your want to delete this translation?"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setShow(false)}
      />
    </div>
  );
};

export default DeleteTranslationButton;
