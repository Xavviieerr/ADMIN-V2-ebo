"use client";

import React, { useRef, useState } from "react";
import TranslationList from "./preview-translation-list";
import { Loader } from "lucide-react";
import { playAudio } from "@/helpers";
import SensesList from "./preview-senses-list";
import { useAddWordWizard } from "./contexts/AddWordWizardContext";
import { useSubmitWord } from "./preview/useSubmitWord";
import PreviewSummary from "./preview/preview-summary";

const Preview = () => {
  const { data } = useAddWordWizard();
  const { submitting, handleSubmit } = useSubmitWord();

  const [tab, setTab] = useState<"senses" | "translations">("senses");
  const [lang, setLang] = useState<"English" | "Korean">("English");
  const [playing, setPlaying] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const getTranslations = () => {
    const korTrans = data.oho.map((item) => item.translations.kor);
    const engTrans = data.oho.map((item) => item.translations.eng);

    return lang === "Korean" ? korTrans : engTrans;
  };

  const translations = getTranslations();

  const handlePlay = () => {
    playAudio({
      url: data.oho[0].omra[0],
      audioPlayerRef,
      playing,
      setPlaying,
    });
  };

  return (
    <div className="flex flex-col dark-box md:px-4 px-0 w-full pb-20">
      <div className="flex items-center justify-between gap-4 max-md:border-b border-gray-txt-50/50 max-md:pb-5">
        <h2 className="text-white font-medium text-lg">Preview Word</h2>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="primary-btn font-medium"
        >
          {submitting ? <Loader className="animate-spin" /> : "Submit Word"}
        </button>
      </div>

      <PreviewSummary data={data} playing={playing} onPlay={handlePlay} />

      <div className="flex max-md:flex-col md:items-center justify-between">
        <div className="flex items-center border-b border-gray-txt-50 w-fit my-5">
          {["senses", "translations"].map((item, i) => (
            <button
              key={i}
              onClick={() => setTab(item as "senses" | "translations")}
              className={`px-5 ${tab === item ? "border-b-2 border-foreground-50" : ""} pb-2 cursor-pointer`}
            >
              <p className="capitalize">{item}</p>
            </button>
          ))}
        </div>

        {tab === "translations" && (
          <select
            value={lang}
            onChange={(e) =>
              setLang(e.target.value as "English" | "Korean")
            }
            id="dialect"
            className="input h-10 w-fit text-sm capitalize bg-secondary-bg"
          >
            {["English", "Korean"].map((lang) => (
              <option
                key={lang}
                value={lang}
                className="text-white bg-secondary-bg capitalize"
              >
                {lang}
              </option>
            ))}
          </select>
        )}
      </div>

      {tab == "senses" && <SensesList data={data} />}

      {tab === "translations" && (
        <TranslationList translations={translations} lang={lang} />
      )}
    </div>
  );
};

export default Preview;
