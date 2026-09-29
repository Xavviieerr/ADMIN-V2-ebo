"use client";

import { playAudio } from "@/helpers";
import { PlayCircle, StopCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const PlayAudioButton = ({
  audioUrl,
  size = 18,
}: {
  audioUrl: string;
  size?: number;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [playing, setPlaying] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    playAudio({
      url: audioUrl,
      audioPlayerRef,
      playing,
      setPlaying,
    });
  };
  return (
    <button
      onClick={handlePlay}
      type="button"
      title={playing ? t("common.dictionary.stopAudio", "Stop Audio") : t("common.dictionary.playAudio", "Play Audio")}
      aria-label={playing ? t("common.dictionary.stopAudio", "Stop Audio") : t("common.dictionary.playAudio", "Play Audio")}
      className="cursor-pointer font-medium text-base-green flex items-center gap-1"
    >
      {playing ? <StopCircle size={size} /> : <PlayCircle size={size} />}
      <span className="text-xs font-medium">{playing ? t("common.dictionary.stop", "Stop") : t("common.dictionary.play", "Play")}</span>
    </button>
  );
};

export default PlayAudioButton;
