"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader, Upload } from "lucide-react";
import {
  useUpdateSenseAudioMutation,
  useUpdateSenseExampleSentenceAudioMutation,
  useUpdateTranslationAudioMutation,
  useUpdateTranslationExampleSentenceAudioMutation,
  useUploadAudioMutation,
} from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { useStagedMediaFile } from "@/features/shared/hooks/useStagedMediaFile";
import MediaPreviewModal from "@/features/shared/components/media-preview-modal";
import { useParams, useRouter } from "next/navigation";
import { validateAudioFile } from "./audio/audioValidation";
import { saveUploadedAudio } from "./audio/audioSaveStrategies";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
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
  const [approving, setApproving] = useState(false);
  const { staged, stage, clear } = useStagedMediaFile();

  const router = useRouter();

  const params = useParams();
  const id = params?.id as string;

  const showAudioPicker = () => {
    return audioRef.current?.click();
  };

  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) {
      toast.error(t("common.dictionary.noFileSelected", "You did not select any file. Kindly select one to proceed"));
      return;
    }

    const file = e.target.files[0];
    const validationError = validateAudioFile(file);
    if (validationError === "invalid-type") {
      toast.error(t("common.dictionary.validAudioFile", "Please select a valid audio file"));
      return;
    }
    if (validationError === "too-large") {
      toast.error(t("common.dictionary.audioSizeLimit", "Size Limit Reached! You cannot attach an audio file larger than 5mb."));
      return;
    }

    e.target.value = "";

    stage(file);
  };

  const handleUpload = async ({ file }: { file: File }) => {
    return await runDictionaryMutation({
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
      successMessage: t("common.dictionary.audioUploaded", "Audio uploaded successfully"),
      errorMessage: t("common.dictionary.failedToUploadAudio", "Failed to upload audio"),
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
        onClick={showAudioPicker}
        type="button"
        title={t("common.dictionary.uploadAudio", "Upload Audio")}
        aria-label={t("common.dictionary.uploadAudio", "Upload Audio")}
        className="cursor-pointer font-medium text-foreground-50 px-2 flex items-center gap-1"
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
          <>
            <Upload strokeWidth={1.4} size={20} />
            <span className="text-xs font-medium">{t("common.dictionary.upload", "Upload")}</span>
          </>
        )}
      </button>

      <MediaPreviewModal
        open={Boolean(staged)}
        kind="audio"
        previewUrl={staged?.url ?? ""}
        fileName={staged?.file.name}
        approving={approving}
        onApprove={handleApprove}
        onClear={clear}
      />
    </div>
  );
};

export default AudioUploader;
