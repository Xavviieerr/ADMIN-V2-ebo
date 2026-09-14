"use client";

import { playAudio } from "@/helpers";
import { PlayCircle, StopCircle } from "lucide-react";
import React, { useRef, useState } from "react";

const PlayAudioButton = ({
  audioUrl,
  size = 18,
}: {
  audioUrl: string;
  size?: number;
}) => {
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
      title="Play Audio"
      className="cursor-pointer font-medium text-base-green"
    >
      {playing ? <StopCircle size={size} /> : <PlayCircle size={size} />}
    </button>
  );
};

export default PlayAudioButton;
