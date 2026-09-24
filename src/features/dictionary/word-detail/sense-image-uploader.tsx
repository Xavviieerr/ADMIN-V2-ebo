"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import { Loader, Upload } from "lucide-react";
import {
  useUpdateSenseImageMutation,
  useUploadImageMutation,
} from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/hooks/runDictionaryMutation";
import { useParams, useRouter } from "next/navigation";

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
  const maxFileSize = 5 * 1024 * 1024;
  const imageRef = useRef<HTMLInputElement>(null);
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [saveSenseImage, { isLoading: isSaving }] =
    useUpdateSenseImageMutation();
  const loading = isUploading || isSaving;

  const router = useRouter();

  const params = useParams();
  const id = params?.id as string;

  const showImagePicker = () => {
    return imageRef.current?.click();
  };

  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) {
      toast.error("You did not select any file. Kindly select one to proceed");
      return;
    }

    const file = e.target.files[0];
    const image = file.type.startsWith("image/");
    if (!image) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > maxFileSize) {
      toast.error(
        "Size Limit Reached! You cannot attach an image file larger than 5mb.",
      );
      return;
    }

    e.target.value = "";

    handleUpload({ file });
  };

  const handleUpload = async ({ file }: { file: File }) => {
    await runDictionaryMutation({
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
      successMessage: "Image uploaded successfully",
      errorMessage: "Failed to upload image",
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  return (
    <div className="flex items-end gap-4">
      <button
        onClick={showImagePicker}
        type="button"
        title="Upload Image"
        className="cursor-pointer font-medium text-foreground-50 px-2"
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

        {!loading && !large && <Upload strokeWidth={1.4} size={size} />}

        {!loading && large && (
          <p className="text-sm secondary-btn">Add Image</p>
        )}
      </button>
    </div>
  );
};

export default SenseImageUploader;
