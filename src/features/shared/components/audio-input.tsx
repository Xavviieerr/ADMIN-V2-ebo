"use client";
import { Loader, PlayCircle, StopCircle, Trash2, Upload } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { uploadAudio } from "@/features/shared/api";
import { playAudio } from "@/helpers";
import MediaPreviewModal from "@/features/shared/components/media-preview-modal";
import { useStagedMediaFile } from "@/features/shared/hooks/useStagedMediaFile";
import { useKeyboard } from "./keyboard-context";

const AudioInput = ({
  label,
  placeholder,
  disabled = false,
  showDelete = false,
  input,
  audioUrl,
  setValue,
  setAudio,
  handleDelete,
}: {
  label?: string;
  disabled?: boolean;
  showDelete?: boolean;
  input: string;
  audioUrl?: string;
  setValue: (value: string) => void;
  setAudio: (value: string) => void;
  placeholder?: string;
  handleDelete?: () => void;
}) => {
  const [playing, setPlaying] = useState(false);
  const maxFileSize = 5 * 1024 * 1024;
  const audioRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState(audioUrl);

  const { staged, stage, clear } = useStagedMediaFile();

  const [file, setFile] = useState<{
    id: string;
    url: string;
    file: File;
  } | null>();

  const showAudioPicker = () => {
    return audioRef.current?.click();
  };

  const formData = new FormData();

  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    stage(file);
  };

  const handleUpload = async ({ file }: { file: File }) => {
    formData.append("audioFile", file);

    const token = getAccessToken();
    if (!token) return false;

    const res = await uploadAudio({ token, formData });

    if (res) {
      setAudio(res.original);
    }
    setLoading(false);
    return Boolean(res);
  };

  const handleApprove = async () => {
    if (!staged) return;
    setLoading(true);
    try {
      const ok = await handleUpload({ file: staged.file });
      if (ok) clear();
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!file && !url) return;

    const audioSource = file?.url || url;
    if (!audioSource) return;

    playAudio({
      url: audioSource,
      audioPlayerRef,
      playing,
      setPlaying,
    });
  };

  useEffect(() => {
    if (audioUrl) {
      setUrl(audioUrl);
    }
  }, [audioUrl]);

  const valueRef = useRef(input);
  const cursorRef = useRef(0);
  const pendingCaretRef = useRef<number | null>(null);
  const inputElRef = useRef<HTMLInputElement>(null);
  const { setActiveField } = useKeyboard();

  useEffect(() => {
    valueRef.current = input;
  }, [input]);

  useLayoutEffect(() => {
    if (pendingCaretRef.current !== null && inputElRef.current) {
      const pos = pendingCaretRef.current;
      pendingCaretRef.current = null;
      inputElRef.current.focus();
      inputElRef.current.setSelectionRange(pos, pos);
      cursorRef.current = pos;
    }
  }, [input]);

  return (
    <div className="flex flex-col w-full gap-2">
      {label && <label htmlFor={label}>{label}</label>}

      <div className="flex max-md:flex-col-reverse md:items-center items-end gap-4">
        <input
          ref={inputElRef}
          type="text"
          id="label"
          disabled={disabled}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setValue(e.target.value)}
          onSelect={(e) => {
            cursorRef.current = e.currentTarget.selectionStart ?? input.length;
          }}
          onFocus={(e) => {
            cursorRef.current = e.currentTarget.selectionStart ?? input.length;
            setActiveField({
              getValue: () => valueRef.current,
              setValue,
              getCursorPos: () => cursorRef.current,
              setCursorPos: (pos) => {
                pendingCaretRef.current = pos;
              },
            });
          }}
          // onBlur={() => setActiveField(null)}
          className="input disabled:cursor-not-allowed disabled:opacity-50"
        />

        <div className="flex items-center gap-4 max-md:w-full justify-between">
          <button
            onClick={showAudioPicker}
            type="button"
            aria-label="Upload audio"
            className="secondary-btn font-medium min-h-11 min-w-11 flex items-center justify-center"
          >
            <input
              type="file"
              className="hidden"
              ref={audioRef}
              accept=".mp3, .wav, .ogg, .flac"
              onChange={handleFilePicker}
            />
            {loading ? (
              <Loader strokeWidth={1.4} className="animate-spin" />
            ) : (
              <Upload strokeWidth={1.4} />
            )}
          </button>

          {(file || url) && (
            <button
              onClick={handleClick}
              type="button"
              aria-label={playing ? "Stop audio" : "Play audio"}
              className="secondary-btn font-medium min-h-11 min-w-11 flex items-center justify-center"
            >
              {playing ? (
                <StopCircle strokeWidth={1.4} />
              ) : (
                <PlayCircle strokeWidth={1.4} />
              )}
            </button>
          )}

          {showDelete && (
            <button
              onClick={handleDelete}
              type="button"
              aria-label="Delete audio"
              className="min-h-11 min-w-11 flex items-center justify-center cursor-pointer"
            >
              <Trash2
                className="text-red-500"
                strokeWidth={1.4}
                size={20}
              />
            </button>
          )}
        </div>
      </div>

      <MediaPreviewModal
        open={Boolean(staged)}
        kind="audio"
        previewUrl={staged?.url ?? ""}
        fileName={staged?.file.name}
        approving={loading}
        onApprove={handleApprove}
        onClear={clear}
      />
    </div>
  );
};

export default AudioInput;
