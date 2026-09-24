"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import { Loader, Upload } from "lucide-react";
import {
  useUpdateSenseAudioMutation,
  useUpdateSenseExampleSentenceAudioMutation,
  useUpdateTranslationAudioMutation,
  useUpdateTranslationExampleSentenceAudioMutation,
  useUploadAudioMutation,
} from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/hooks/runDictionaryMutation";
import { useParams, useRouter } from "next/navigation";
import { validateAudioFile } from "./audio/audioValidation";
import { saveUploadedAudio } from "./audio/audioSaveStrategies";

type AudioPayload =
  | { senseId: string; senseIndex: number; exampleSentenceIndex?: number }
  | {
      translationId: string;
      translationIndex: number;
      languageType: string;
      exampleSentenceIndex?: number;
    };

const AudioUploader = ({
  type,
  payload,
}: {
  type: "sense" | "senseExample" | "translation" | "translationExample";
  payload: AudioPayload;
}) => {
  const audioRef = useRef<HTMLInputElement>(null);
  const [uploadAudio, { isLoading: isUploading }] = useUploadAudioMutation();
  const [saveSenseAudio, { isLoading: isSavingSense }] =
    useUpdateSenseAudioMutation();
  const [saveSenseExampleAudio, { isLoading: isSavingSenseExample }] =
    useUpdateSenseExampleSentenceAudioMutation();
  const [saveTranslationAudio, { isLoading: isSavingTranslation }] =
    useUpdateTranslationAudioMutation();
  const [saveTranslationExampleAudio, { isLoading: isSavingTranslationExample }] =
    useUpdateTranslationExampleSentenceAudioMutation();
  const loading =
    isUploading ||
    isSavingSense ||
    isSavingSenseExample ||
    isSavingTranslation ||
    isSavingTranslationExample;

  const router = useRouter();

  const params = useParams();
  const id = params?.id as string;

  const showAudioPicker = () => {
    return audioRef.current?.click();
  };

  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) {
      toast.error("You did not select any file. Kindly select one to proceed");
      return;
    }

    const file = e.target.files[0];
    const validationError = validateAudioFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    e.target.value = "";

    handleUpload({ file });
  };

  const handleUpload = async ({ file }: { file: File }) => {
    await runDictionaryMutation({
      run: async () => {
        const res = await uploadAudio(file).unwrap();

        await saveUploadedAudio({
          type,
          wordId: id,
          payload,
          url: res.original,
          mutations: {
            saveSenseAudio,
            saveSenseExampleAudio,
            saveTranslationAudio,
            saveTranslationExampleAudio,
          },
        });
      },
      successMessage: "Audio uploaded successfully",
      errorMessage: "Failed to upload audio",
      onSuccess: () => {
        router.refresh();
      },
    });
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
