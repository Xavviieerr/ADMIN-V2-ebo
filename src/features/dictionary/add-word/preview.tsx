"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import TranslationList from "./preview-translation-list";
import { Loader, X } from "lucide-react";
import { playAudio } from "@/helpers";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import SensesList from "./preview-senses-list";
import { useAddWordWizard } from "./contexts/AddWordWizardContext";
import { useSubmitWord } from "./preview/useSubmitWord";
import PreviewSummary from "./preview/preview-summary";

const Preview = () => {
  const { data } = useAddWordWizard();
  const { submitting, handleSubmit, duplicateError, clearDuplicateError } =
    useSubmitWord();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

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
        <h2 className="text-white font-medium text-lg">{t("common.dictionary.previewWord", "Preview Word")}</h2>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="primary-btn font-medium"
        >
          {submitting ? <Loader className="animate-spin" /> : t("common.dictionary.submitWord", "Submit Word")}
        </button>
      </div>

      <PreviewSummary data={data} playing={playing} onPlay={handlePlay} />

      {duplicateError && (
        <div className="w-full rounded-md border border-dashed border-base-red bg-red-500/10 px-5 py-3 text-center text-sm text-base-red">
          <div className="flex items-center justify-center gap-4">
            <p>{duplicateError.message}</p>
            <button
              type="button"
              onClick={clearDuplicateError}
              aria-label={t("common.dictionary.clearMedia", "Clear")}
            >
              <X size={16} />
            </button>
          </div>
          {duplicateError.existingWordId && (
            <Link
              href={`/guonopedia/dictionary/${duplicateError.existingWordId}`}
              className="mt-2 inline-block font-medium underline"
            >
              {t("common.dictionary.viewExistingWord", "View existing word")}
            </Link>
          )}
        </div>
      )}

      <div className="flex max-md:flex-col md:items-center justify-between">
        <div className="flex items-center border-b border-gray-txt-50 w-fit my-5">
          {["senses", "translations"].map((item, i) => (
            <button
              key={i}
              onClick={() => setTab(item as "senses" | "translations")}
              className={`px-5 ${tab === item ? "border-b-2 border-foreground-50" : ""} pb-2 cursor-pointer`}
            >
              <p className="capitalize">{t(item === "senses" ? "common.dictionary.sensesTab" : "common.dictionary.translationsTab", item)}</p>
            </button>
          ))}
        </div>

        {tab === "translations" && (
          <div className="flex flex-col gap-2 max-md:w-full">
            <label htmlFor="preview-lang" className="text-sm">
              {t("common.dictionary.translationLanguage", "Translation language")}
            </label>
          <select
            value={lang}
            onChange={(e) =>
              setLang(e.target.value as "English" | "Korean")
            }
            id="preview-lang"
            aria-label={t("common.dictionary.translationLanguage", "Translation language")}
            className="input h-10 w-fit text-sm capitalize bg-secondary-bg max-md:w-full"
          >
            {[
              { value: "English", label: t("common.dictionary.englishLang", "English") },
              { value: "Korean", label: t("common.dictionary.koreanLang", "Korean") },
            ].map((lang) => (
              <option
                key={lang.value}
                value={lang.value}
                className="text-white bg-secondary-bg capitalize"
              >
                {lang.label}
              </option>
            ))}
          </select>
          </div>
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
