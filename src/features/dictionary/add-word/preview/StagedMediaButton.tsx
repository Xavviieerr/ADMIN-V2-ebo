"use client";

import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { uploadAudio, uploadImage } from "@/features/shared/api";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import MediaPreviewModal from "@/features/shared/components/media-preview-modal";

const StagedMediaButton = ({
  kind,
  onUploaded,
  label,
  maxBytes = 5 * 1024 * 1024,
}: {
  kind: "image" | "audio";
  onUploaded: (url: string) => void;
  label?: string;
  maxBytes?: number;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const pickerRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<{ file: File; url: string } | null>(
    null,
  );
  const [approving, setApproving] = useState(false);

  const accept = kind === "image" ? "image/*" : "audio/*";

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const validType =
      kind === "image"
        ? file.type.startsWith("image/")
        : file.type.startsWith("audio/");
    if (!validType) {
      toast.error(
        t(
          kind === "image"
            ? "common.dictionary.validImageFile"
            : "common.dictionary.validAudioFile",
          kind === "image"
            ? "Please select a valid image file"
            : "Please select a valid audio file",
        ),
      );
      return;
    }

    if (file.size > maxBytes) {
      toast.error(
        t(
          "common.dictionary.mediaSizeLimit",
          "Size Limit Reached! This file is larger than the allowed size.",
        ),
      );
      return;
    }

    if (staged) URL.revokeObjectURL(staged.url);
    setStaged({ file, url: URL.createObjectURL(file) });
  };

  const handleClear = () => {
    if (staged) URL.revokeObjectURL(staged.url);
    setStaged(null);
  };

  const handleApprove = async () => {
    if (!staged) return;
    const token = getAccessToken();
    if (!token) return;

    setApproving(true);
    try {
      const formData = new FormData();
      if (kind === "image") {
        formData.append("imageFile", staged.file);
        formData.append("preferredFormat", "webp");
        formData.append("quality", "80");
        const { data } = await uploadImage({ token, formData });
        if (!data) throw new Error("upload failed");
        onUploaded(data);
      } else {
        formData.append("audioFile", staged.file);
        const res = await uploadAudio({ token, formData });
        if (!res) throw new Error("upload failed");
        onUploaded(res.original);
      }
      handleClear();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setApproving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => pickerRef.current?.click()}
        title={
          label ??
          t(
            kind === "image"
              ? "common.dictionary.uploadImage"
              : "common.dictionary.uploadAudio",
            kind === "image" ? "Upload Image" : "Upload Audio",
          )
        }
        aria-label={
          label ??
          t(
            kind === "image"
              ? "common.dictionary.uploadImage"
              : "common.dictionary.uploadAudio",
            kind === "image" ? "Upload Image" : "Upload Audio",
          )
        }
        className="cursor-pointer font-medium text-foreground-50 px-2 flex items-center gap-1"
      >
        <input
          type="file"
          className="hidden"
          ref={pickerRef}
          accept={accept}
          onChange={handlePick}
        />
        <Upload strokeWidth={1.4} size={20} />
        <span className="text-xs font-medium">
          {label ??
            t(
              kind === "image"
                ? "common.dictionary.uploadImage"
                : "common.dictionary.uploadAudio",
              kind === "image" ? "Upload Image" : "Upload Audio",
            )}
        </span>
      </button>

      <MediaPreviewModal
        open={Boolean(staged)}
        kind={kind}
        previewUrl={staged?.url ?? ""}
        fileName={staged?.file.name}
        approving={approving}
        onApprove={handleApprove}
        onClear={handleClear}
      />
    </>
  );
};

export default StagedMediaButton;
