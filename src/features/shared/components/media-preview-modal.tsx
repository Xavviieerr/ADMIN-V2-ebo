"use client";

import React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import ModalLayout from "@/features/shared/modal-layout";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const MediaPreviewModal = ({
  open,
  kind,
  previewUrl,
  fileName,
  approving,
  onApprove,
  onClear,
}: {
  open: boolean;
  kind: "image" | "audio";
  previewUrl: string;
  fileName?: string;
  approving: boolean;
  onApprove: () => void;
  onClear: () => void;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  if (!open) return null;

  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col w-full">
        <h2 className="text-white font-medium text-base">
          {t("common.dictionary.mediaPreview", "Preview media")}
        </h2>

        <div className="flex flex-col items-center gap-4 w-full mt-5">
          {kind === "image" ? (
            <div className="h-60 w-full max-w-md shrink-0 flex items-center justify-center bg-gray-txt-50/10 rounded-md relative">
              <Image
                src={previewUrl}
                alt={t("common.dictionary.previewAlt", "Selected media preview")}
                fill
                className="rounded-md object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full">
              {fileName && (
                <p className="text-sm text-gray-txt-50 break-all text-center">
                  {fileName}
                </p>
              )}
              <audio controls src={previewUrl} className="w-full max-w-md" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-5 justify-center">
          <button onClick={onClear} className="secondary-btn">
            {t("common.dictionary.clearMedia", "Clear")}
          </button>

          <button
            disabled={approving}
            onClick={onApprove}
            className="primary-btn px-16"
          >
            {approving ? (
              <Loader2 className="animate-spin" />
            ) : (
              t("common.dictionary.approveMedia", "Approve & Upload")
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default MediaPreviewModal;
