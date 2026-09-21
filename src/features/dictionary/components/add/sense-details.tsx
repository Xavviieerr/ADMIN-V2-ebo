"use client";

import { SenseData } from "@/features/dictionary/lib";
import React, { useRef, useState } from "react";
import { ChevronDown, StopCircle, Volume2 } from "lucide-react";
import { playAudio } from "@/helpers";

type Sense = {
  urhData: SenseData;
  engData: SenseData;
  korData: SenseData;
};

const SenseDetails = ({
  ota,
  sense,
  editSense,
}: {
  ota: string;
  sense: Sense;
  editSense: (sense: Sense) => void;
  length: number;
}) => {
  const [lang, setLang] = useState<"urh" | "eng" | "kor">("urh");
  const [collapsed, setCollapsed] = useState(true);

  const [playing, setPlaying] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const getSense = () => {
    switch (lang) {
      case "urh":
        return { ...sense.urhData, headWord: ota };
      case "eng":
        return sense.engData;
      case "kor":
        return sense.korData;
    }
  };

  const handlePlay = () => {
    playAudio({
      url: currentSense.audioUrl,
      audioPlayerRef,
      playing,
      setPlaying,
    });
  };

  const currentSense = getSense();

  return (
    <div className="flex max-md:flex-col-reverse max-md:mb-4 gap-4 items-start justify-between p-4 md:p-5 border-2 border-[#dbdcde] text-sm transition-colors duration-300 text-white rounded-2xl md:bg-primary-bg cursor-pointer">
      {currentSense.headWord && (
        <div className="flex flex-col gap-2 max-md:w-full">
          <div className="flex max-md:flex-col md:items-center gap-2">
            <div className="flex items-center gap-3">
              <h3 className="font-bold max-md:text-base text-2xl">
                {currentSense.headWord}
              </h3>

              {currentSense.audioUrl && (
                <button onClick={handlePlay} className="text-foreground-50">
                  {playing ? <StopCircle /> : <Volume2 />}
                </button>
              )}
            </div>

            <div className="flex gap-3 font-normal">
              <span>[{currentSense.pronunciation}]</span>
              <span>/{currentSense.IPA}/</span>

              <span>Part of Speech: {currentSense.partOfSpeech}</span>
            </div>
          </div>

          <p className="text-sm "> {currentSense.meaning}</p>

          <div
            className={`flex md:flex-wrap max-md:flex-col gap-4 ${collapsed ? "max-md:hidden" : ""}`}
          >
            {currentSense.plurals.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Plurals:</span>
                {currentSense.plurals.join(", ")}
              </div>
            )}
            {currentSense.synonyms.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Synonyms:</span>
                {currentSense.synonyms.map((item) => item.ota).join(", ")}
              </div>
            )}

            {currentSense.antonyms.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Antonyms:</span>
                {currentSense.antonyms.join(", ")}
              </div>
            )}

            {currentSense.relatedWords.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Related Words:</span>
                {currentSense.relatedWords.join(", ")}
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex w-full justify-center transition-all duration-300 md:hidden ${
              collapsed ? "" : "rotate-180"
            }`}
          >
            <ChevronDown />
          </button>
        </div>
      )}

      <div className="flex max-md:w-full max-md:items-end items-center gap-6 ">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "urh" | "eng" | "kor")}
          id="dialect"
          className="input h-10 text-sm capitalize bg-secondary-bg"
        >
          {["urh", "eng", "kor"].map((lang) => (
            <option
              key={lang}
              value={lang}
              className="text-white bg-secondary-bg capitalize"
            >
              {lang}
            </option>
          ))}
        </select>

        <button
          onClick={() => editSense(sense)}
          className="secondary-btn py-2 text-sm w-fit shrink-0"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default SenseDetails;
