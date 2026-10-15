"use client";

import MediaPreviewModal from "@/features/shared/components/media-preview-modal";
import { useStagedMediaFile } from "@/features/shared/hooks/useStagedMediaFile";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uploadFigureImage } from "../api/figures";
import { getFigureErrorMessage } from "../api/errors";

const MAX_BYTES = 3 * 1024 * 1024;

export default function StagedImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { staged, stage, clear } = useStagedMediaFile();
  const [approving, setApproving] = useState(false);

  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("common.invalidImage", "Please select an image file"));
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(t("common.imageTooLarge", "Image must be under 3MB"));
      return;
    }
    stage(file);
  };

  const approve = async () => {
    if (!staged) return;
    setApproving(true);
    try {
      const sizes = await uploadFigureImage(staged.file, tokenStorage.getAccessToken(), {
        preferredFormat: "webp",
        quality: 80,
      });
      onChange(sizes.original);
      clear();
    } catch (error) {
      toast.error(getFigureErrorMessage(error, "Failed to upload image"));
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      {value && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-20 h-20 rounded-md object-cover" />
          <button type="button" onClick={() => onChange("")} className="secondary-btn" aria-label="Remove image">
            <X size={16} />
          </button>
        </div>
      )}
      <label className="secondary-btn flex items-center gap-2 cursor-pointer w-fit">
        <Plus size={16} />
        {t("common.addImage", "Add image")}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      <MediaPreviewModal
        open={Boolean(staged)}
        kind="image"
        previewUrl={staged?.url ?? ""}
        fileName={staged?.file.name}
        approving={approving}
        onApprove={approve}
        onClear={clear}
      />
    </div>
  );
}
