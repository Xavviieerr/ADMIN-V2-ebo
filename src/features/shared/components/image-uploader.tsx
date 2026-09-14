"use client";

import { Loader, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { uploadImage } from "@/features/shared/api";
import Image from "next/image";

const ImageUploader = ({
  url,
  setUrl,
  type = "word",
  disabled,
  maxFileSize,
  onSuccess,
}: {
  url?: string;
  setUrl: (data: string) => void;
  type?: "word" | "figures";
  disabled?: boolean;
  maxFileSize: number;
  onSuccess: (data: string) => void;
}) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const showImagePicker = () => {
    return imageRef.current?.click();
  };

  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0)
      return toast.error(
        "You did not select any file. Kindly select one to proceed",
      );

    const file = e.target.files[0];

    if (file.size > maxFileSize) {
      return toast.error(
        "Size Limit Reached! You cannot attach an image larger than 3mb.",
      );
    }

    setLoading(true);

    const url = URL.createObjectURL(file);

    setUrl(url);
    e.target.value = "";

    handleUpload({ file });
  };

  const formData = new FormData();

  const handleUpload = async ({ file }: { file: File }) => {
    formData.append("imageFile", file);
    formData.append("preferredFormat", "webp");
    formData.append("quality", "80");

    const token = getAccessToken();
    if (!token) return;

    const { msg, data } = await uploadImage({ token, formData, type });

    if (data) {
      onSuccess(data);
    }
    setLoading(false);
  };

  return (
    <div
      onClick={showImagePicker}
      className={`h-40 md:w-52 w-full shrink-0 flex items-center justify-center bg-gray-txt-50/10 rounded-md relative ${disabled ? "" : "hover:border border-gray-txt-50/40 hover:cursor-pointer"}`}
    >
      {!loading && !url && <Plus size={64} strokeWidth={1.2} />}

      <input
        type="file"
        className="hidden"
        disabled={disabled}
        ref={imageRef}
        accept="image/*"
        onChange={handleFilePicker}
      />

      {loading && (
        <Loader size={24} className="animate-spin absolute top-1/2" />
      )}

      {url && (
        <Image src={url} fill alt="Figure Image" className="rounded-md" />
      )}
    </div>
  );
};

export default ImageUploader;
