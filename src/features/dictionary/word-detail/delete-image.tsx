"use client";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeleteSenseImageMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { DeleteSenseImagePayload } from "@/features/dictionary/lib";
import { ConfirmPopover } from "@/features/dictionary/word-detail/shared";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const DeleteImageButton = ({
  payload,
  size = 18,
}: {
  payload: DeleteSenseImagePayload;
  size?: number;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [show, setShow] = useState(false);
  const [deleteSenseImage, { isLoading: loading }] =
    useDeleteSenseImageMutation();

  const router = useRouter();

  const id = useParams()?.id as string;
  const handleDelete = async () => {
    await runDictionaryMutation({
      run: () =>
        deleteSenseImage({
          wordId: id,
          senseId: payload.senseId,
          senseIndex: payload.senseIndex,
          url: payload.url,
          imageType: payload.imageType,
        }).unwrap(),
      successMessage: t("common.dictionary.imageDeleted", "Image deleted successfully"),
      errorMessage: t("common.dictionary.failedToDeleteImage", "Failed to delete image"),
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
        title={t("common.dictionary.deleteImage", "Delete Image")}
        aria-label={t("common.dictionary.deleteImage", "Delete Image")}
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
        message={t("common.dictionary.confirmDeleteImage", "Are you sure you want to delete this image?")}
        loading={loading}
        className="top-7"
        onConfirm={handleDelete}
        onCancel={() => setShow(false)}
      />
    </div>
  );
};

export default DeleteImageButton;
