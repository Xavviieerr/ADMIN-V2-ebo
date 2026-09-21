"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { Loader, Upload } from "lucide-react";
import { uploadAudio } from "@/features/shared/api";
import { useParams, useRouter } from "next/navigation";
import {
  saveSenseAudio,
  saveSenseExampleAudio,
  saveTranslationAudio,
  saveTranslationExampleAudio,
} from "@/features/dictionary/lib/api/save-uploaded-audio";

const AudioUploader = ({
  type,
  payload,
}: {
  type: "sense" | "senseExample" | "translation" | "translationExample";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}) => {
  const maxFileSize = 5 * 1024 * 1024;
  const audioRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const token = getAccessToken();

  const router = useRouter();

  const params = useParams();
  const id = params?.id as string;

  const [, setFile] = useState<{
    id: string;
    url: string;
    file: File;
  } | null>(null);

  const showAudioPicker = () => {
    return audioRef.current?.click();
  };

  const formData = new FormData();

  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    if (!e.target.files || e.target.files.length <= 0)
      return toast.error(
        "You did not select any file. Kindly select one to proceed",
      );

    const file = e.target.files[0];
    const isAudio = file.type.startsWith("audio/");
    if (!isAudio) return toast.error("Please select a valid audio file");

    if (file.size > maxFileSize) {
      return toast.error(
        "Size Limit Reached! You cannot attach an audio file larger than 5mb.",
      );
    }

    const url = URL.createObjectURL(file);

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
    formData.append("audioFile", file);

    if (!token) return;

    const res = await uploadAudio({ token, formData });

    if (res) {
      const data = JSON.stringify({ ...payload, url: res.original });

      if (type === "sense") {
        await saveSenseAudio({ id, token, payload: data });
      }

      if (type === "senseExample") {
        await saveSenseExampleAudio({ id, token, payload: data });
      }

      if (type === "translation") {
        await saveTranslationAudio({ id, token, payload: data });
      }

      if (type === "translationExample") {
        await saveTranslationExampleAudio({ id, token, payload: data });
      }

      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-end gap-4">
      <button
        onClick={showAudioPicker}
        type="button"
        title="Upload Audio"
        className="cursor-pointer font-medium text-foreground-50 px-2"
      >
        <input
          type="file"
          className="hidden"
          ref={audioRef}
          disabled={loading}
          accept="audio/*"
          onChange={handleFilePicker}
        />
        {loading ? (
          <Loader strokeWidth={1.4} className="animate-spin" size={20} />
        ) : (
          <Upload strokeWidth={1.4} size={20} />
        )}
      </button>
    </div>
  );
};

export default AudioUploader;
