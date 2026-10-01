"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { validateWordDetails } from "@/features/dictionary/add-word/lib/validate-word";
import { useAddWordWizard } from "./contexts/AddWordWizardContext";
import { useWizardStep } from "@/features/dictionary/add-word/hooks/useWizardStep";
import {
  BaseInput,
  BaseTextArea,
  ErrorWidget,
  // ImageUploader, // image upload hidden: audio-only for now, re-enable when client wants both
} from "@/features/shared";
import StagedMediaButton from "./preview/StagedMediaButton";
import PlayAudioButton from "@/features/dictionary/word-detail/play-audio";
import PermissionGate from "@/features/shared/permission-gate";

const WordDetails = ({
  dialects,
}: {
  dialects: { name: string; id: string }[];
}) => {
  const { data, setData } = useAddWordWizard();
  const { goStep } = useWizardStep();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [error, setError] = useState<string>("");
  const dialectDropdownRef = useRef<HTMLDivElement>(null);
  const [showDialectOptions, setShowDialectOptions] = useState(false);

  useEffect(() => {
    if (!showDialectOptions) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dialectDropdownRef.current &&
        !dialectDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDialectOptions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showDialectOptions]);

  const getValidationKey = (msg: string) => {
    if (msg === "Please enter the Urhobo word") return "common.dictionary.enterWord";
    if (msg === "Please select a dialect") return "common.dictionary.selectDialect";
    if (msg === "Please enter the explanation for this new word")
      return "common.dictionary.enterReason";
    return "common.dictionary.enterWord";
  };

  const handleSubmit = () => {
    const res = validateWordDetails(data);
    if (res) {
      toast.error(t(getValidationKey(res), res));
      return setError(res);
    }

    setError("");
    return goStep("senses");
  };

  return (
    <div className="flex flex-col dark-box px-4 w-full pb-20">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-white font-medium text-lg">{t("common.dictionary.addWordDetails", "Add Word Details")}</h2>

        <button
          onClick={handleSubmit}
          className="primary-btn font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("common.dictionary.continue", "Continue")}
        </button>
      </div>

      <ErrorWidget message={error ? t(getValidationKey(error), error) : error} action={() => setError("")} />

      <div className="flex flex-col md:px-8 px-4 py-6 bg-gray-txt-100 my-5 rounded-md w-full">
        <div className="flex items-center gap-3">
          <h2>{t("common.dictionary.wordDetailsTitle", "Word Details")}</h2>
        </div>

        <div className="flex max-md:flex-col md:items-start gap-10">
          <div className="grid md:grid-cols-2 w-full mt-5 gap-4">
            <BaseInput
              placeholder={t("common.dictionary.enterUrhoboWord", "Enter the Urhobo Word")}
              value={data.ota}
              setValue={(val) => setData({ ...data, ota: val as string })}
            />

            <div
              ref={dialectDropdownRef}
              role="button"
              tabIndex={0}
              aria-haspopup="listbox"
              aria-expanded={showDialectOptions}
              aria-label={t("common.dictionary.dialectLabel", "Dialect")}
              onClick={() => setShowDialectOptions(!showDialectOptions)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowDialectOptions(!showDialectOptions);
                }
                if (e.key === "Escape") {
                  setShowDialectOptions(false);
                }
              }}
              className="flex items-center justify-between gap-4 min-w-30 relative bg-secondary-bg focus:ring-1 ring-foreground-50 px-5 py-3 h-12 rounded-lg outline-none cursor-pointer"
            >
              <p className={data.erevwe ? "capitalize" : "text-gray-txt-50"}>
                {data.erevwe ||
                  t("common.dictionary.selectDialectPlaceholder", "Select a dialect")}
              </p>
              <ChevronDown
                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${showDialectOptions ? "rotate-180" : ""}`}
              />

              {showDialectOptions && (
                <div
                  role="listbox"
                  aria-label={t("common.dictionary.dialectLabel", "Dialect")}
                  className="absolute top-full left-0 mt-2 w-full min-w-52 max-h-72 overflow-y-auto custom-scrollbar z-20 transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={!data.erevwe}
                    onClick={() => {
                      setData({ ...data, erevwe: "" });
                      setShowDialectOptions(false);
                    }}
                    className={`w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer text-gray-txt-50 ${!data.erevwe ? "text-foreground-50 font-medium" : ""}`}
                  >
                    {t("common.dictionary.selectDialectPlaceholder", "Select a dialect")}
                  </button>
                  {dialects.map((dialect) => (
                    <button
                      key={dialect.id}
                      type="button"
                      role="option"
                      aria-selected={data.erevwe === dialect.name}
                      onClick={() => {
                        setData({ ...data, erevwe: dialect.name });
                        setShowDialectOptions(false);
                      }}
                      className={`w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer capitalize ${data.erevwe === dialect.name ? "text-foreground-50 font-medium" : ""}`}
                    >
                      {dialect.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {data.otaOkpopko && (
              <BaseTextArea
                placeholder={t("common.dictionary.enterExplanation", "Enter the explanation for this new word")}
                styling="md:col-span-2"
                value={data.creationReason}
                setValue={(val) => setData({ ...data, creationReason: val })}
              />
            )}

            <div className="flex items-center gap-6 md:justify-self-start">
              <label htmlFor="newlyCoined" className="text-sm">
                {t("common.dictionary.newlyCoined", "Is this a newly coined word?")}
              </label>

              <input
                type="checkbox"
                name="newlyCoined"
                checked={data.otaOkpopko}
                onChange={(e) =>
                  setData({
                    ...data,
                    otaOkpopko: e.target.checked,
                    creationReason: e.target.checked ? "" : "n/a",
                  })
                }
                id="newlyCoined"
                className="w-5 h-5"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-txt-50/20 bg-secondary-bg/50 p-4 flex flex-col gap-3 md:col-span-2">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <PermissionGate permission="add_media">
              <StagedMediaButton
                kind="audio"
                label={
                  data.audio
                    ? t("common.dictionary.updateAudio", "Update Audio")
                    : t("common.dictionary.uploadAudio", "Upload Audio")
                }
                onUploaded={(val) => setData({ ...data, audio: val })}
              />
              </PermissionGate>
              {data.audio && (
                <>
                  <PlayAudioButton audioUrl={data.audio} />
                  <button
                    type="button"
                    onClick={() => setData({ ...data, audio: "" })}
                    className="text-sm text-base-red cursor-pointer"
                    aria-label={t("common.dictionary.clearMedia", "Clear")}
                  >
                    {t("common.dictionary.clearMedia", "Clear")}
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-txt-50">
              {t("common.dictionary.wordAudioHint", "Add a recording of the word so learners can hear how it sounds")}
            </p>
          </div>

          {/*
          Image upload hidden: audio-only for now.
          Re-enable when the client wants both image and audio.
          <ImageUploader
            url={url}
            setUrl={setUrl}
            maxFileSize={maxFileSize}
            onSuccess={(v) => setData({ ...data, image: v })}
          />
          */}
        </div>
      </div>
    </div>
  );
};

export default WordDetails;
