"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader, Upload } from "lucide-react";
import {
  useUpdateSenseImageMutation,
  useUploadImageMutation,
} from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { useStagedMediaFile } from "@/features/shared/hooks/useStagedMediaFile";
import MediaPreviewModal from "@/features/shared/components/media-preview-modal";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const SenseImageUploader = ({
  type = "photo",
  payload,
  size = 20,
  large = false,
}: {
  type?: "photo" | "illustration";
  payload: { senseId: string; senseIndex: number };
  size?: number;
  large?: boolean;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const maxFileSize = 5 * 1024 * 1024;
  const imageRef = useRef<HTMLInputElement>(null);
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [saveSenseImage, { isLoading: isSaving }] =
    useUpdateSenseImageMutation();
  const loading = isUploading || isSaving;
  const [approving, setApproving] = useState(false);
  const { staged, stage, clear } = useStagedMediaFile();

  const router = useRouter();

  const params = useParams();
  const id = params?.id as string;

  const showImagePicker = () => {
    return imageRef.current?.click();
  };

  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) {
      toast.error(t("common.dictionary.noFileSelected", "You did not select any file. Kindly select one to proceed"));
      return;
    }

    const file = e.target.files[0];
    const image = file.type.startsWith("image/");
    if (!image) {
      toast.error(t("common.dictionary.validImageFile", "Please select a valid image file"));
      return;
    }

    if (file.size > maxFileSize) {
      toast.error(t("common.dictionary.imageSizeLimit", "Size Limit Reached! You cannot attach an image file larger than 5mb."));
      return;
    }

    e.target.value = "";

    stage(file);
  };

  const handleUpload = async ({ file }: { file: File }) => {
    return await runDictionaryMutation({
      run: async () => {
        const res = await uploadImage(file).unwrap();

        await saveSenseImage({
          wordId: id,
          senseId: payload.senseId,
          senseIndex: payload.senseIndex,
          url: res.original,
          imageType: type,
        }).unwrap();
      },
      successMessage: t("common.dictionary.imageUploaded", "Image uploaded successfully"),
      errorMessage: t("common.dictionary.failedToUploadImage", "Failed to upload image"),
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  const handleApprove = async () => {
    if (!staged) return;
    setApproving(true);
    try {
      const ok = await handleUpload({ file: staged.file });
      if (ok) clear();
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="flex items-end gap-4">
      <button
        onClick={showImagePicker}
        type="button"
        title={t("common.dictionary.uploadImage", "Upload Image")}
        aria-label={t("common.dictionary.uploadImage", "Upload Image")}
        className="cursor-pointer font-medium text-foreground-50 px-2 flex items-center gap-1"
      >
        <input
          type="file"
          className="hidden"
          ref={imageRef}
          disabled={loading}
          accept="image/*"
          onChange={handleFilePicker}
        />
        {loading && (
          <Loader strokeWidth={1.4} className="animate-spin" size={size} />
        )}

        {!loading && !large && (
          <>
            <Upload strokeWidth={1.4} size={size} />
            <span className="text-xs font-medium">{t("common.dictionary.upload", "Upload")}</span>
          </>
        )}

        {!loading && large && (
          <p className="text-sm secondary-btn">{t("common.dictionary.addImage", "Add Image")}</p>
        )}
      </button>

      <MediaPreviewModal
        open={Boolean(staged)}
        kind="image"
        previewUrl={staged?.url ?? ""}
        fileName={staged?.file.name}
        approving={approving}
        onApprove={handleApprove}
        onClear={clear}
      />
    </div>
  );
};

export default SenseImageUploader;
