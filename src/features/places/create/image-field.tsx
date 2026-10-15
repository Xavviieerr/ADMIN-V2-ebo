"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader, Plus, X } from "lucide-react";
import Image from "next/image";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { uploadPlaceImage } from "../api/places";
import { getPlaceErrorMessage } from "../api/errors";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

// Upload field for place images (cover/logo/gallery). Uploads immediately
// via POST /places/image/upload and stores the returned `original` URL.
const ImageField = ({
  label,
  value,
  onChange,
  multiple = false,
}: {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const urls = multiple ? (value as string[]) : value ? [value as string] : [];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = Array.from(files).slice(0, multiple ? files.length : 1);
    const oversized = picked.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      toast.error(
        t("common.imageTooLarge", "Size Limit Reached! You cannot attach an image larger than 3mb."),
      );
      return;
    }
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of picked) {
        const sizes = await uploadPlaceImage(file, tokenStorage.getAccessToken(), {
          preferredFormat: "webp",
          quality: 80,
        });
        uploaded.push(sizes.original);
      }
      onChange(multiple ? [...(value as string[]), ...uploaded] : (uploaded[0] ?? ""));
    } catch (error) {
      toast.error(getPlaceErrorMessage(error, "Failed to upload image"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (url: string) => {
    if (multiple) onChange((value as string[]).filter((u) => u !== url));
    else onChange("");
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm">{label}</span>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-md overflow-hidden bg-secondary-bg shrink-0">
              <Image src={url} alt={label} fill unoptimized className="object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label={t("common.delete", "Delete")}
                className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/heic,image/heif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="secondary-btn w-fit flex items-center gap-2 disabled:opacity-50"
      >
        {uploading ? <Loader className="animate-spin" size={16} /> : <Plus size={16} />}
        {t("common.addImage", "Add Image")}
      </button>
    </div>
  );
};

export default ImageField;
