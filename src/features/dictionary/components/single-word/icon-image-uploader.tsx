"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { Loader, Upload } from "lucide-react";
import { uploadImage } from "@/features/shared/api";
import { useParams, useRouter } from "next/navigation";
import { saveSenseImage } from "../../lib/api";

const IconImageUploader = ({
  type = "photo",
  payload,
  size = 20,
  large = false,
}: {
  type?: "photo" | "illustration";
  payload: any;
  size?: number;
  large?: boolean;
}) => {
  const maxFileSize = 5 * 1024 * 1024;
  const imageRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const token = getAccessToken();

  const router = useRouter();

  const params = useParams();
  const id = params?.id as string;

  const [file, setFile] = useState<{
    id: string;
    url: string;
    file: File;
  } | null>(null);

  const showImagePicker = () => {
    return imageRef.current?.click();
  };

  const formData = new FormData();

  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    if (!e.target.files || e.target.files.length <= 0)
      return toast.error(
        "You did not select any file. Kindly select one to proceed",
      );

    const file = e.target.files[0];
    const image = file.type.startsWith("image/");
    if (!image) return toast.error("Please select a valid image file");

    if (file.size > maxFileSize) {
      return toast.error(
        "Size Limit Reached! You cannot attach an image file larger than 5mb.",
      );
    }

    let url;
    url = URL.createObjectURL(file);

    const singleFile = {
      id: Date.now().toString(),
      file,
      url,
    };

    setFile(singleFile);
    e.target.value = "";

    handleUpload({ file });
  };

  const handleUpload = async ({ file }: { file: File }) => {
    formData.append("imageFile", file);
    formData.append("preferredFormat", "webp");
    formData.append("quality", "80");

    if (!token) return;

    const { msg, data: res } = await uploadImage({ token, formData });

    console.log(res);

    if (res) {
      const data = JSON.stringify({
        ...payload,
        url: res,
        imageType: type,
      });

      await saveSenseImage({ id, token, payload: data });

      router.refresh();
    }
    setLoading(false);
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

export default IconImageUploader;
