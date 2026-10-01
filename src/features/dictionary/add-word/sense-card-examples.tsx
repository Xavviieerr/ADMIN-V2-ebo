"use client";

import React from "react";
import { BaseInput } from "@/features/shared";
import { Trash2 } from "lucide-react";
import { SenseData } from "@/features/dictionary/lib";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import StagedMediaButton from "./preview/StagedMediaButton";
import PlayAudioButton from "@/features/dictionary/word-detail/play-audio";
import PermissionGate from "@/features/shared/permission-gate";

const SenseCardExamples = ({
  lang,
  data,
  setData,
  urhExamples,
}: {
  lang: "urh" | "eng" | "kor";
  data: SenseData;
  setData: React.Dispatch<React.SetStateAction<SenseData>>;
  urhExamples?: SenseData["examples"];
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  return (
    <>
      <h2>
        {lang === "urh"
          ? t("common.dictionary.examples", "Urhobo Examples")
          : lang === "kor"
            ? t("common.dictionary.examples", "Korean Examples")
            : t("common.dictionary.examples", "English Examples")}
      </h2>

      {data.examples.map((example, index) => (
        <div key={index} className="flex flex-col">
          {urhExamples && index < urhExamples.length && (
            <p className="font-medium text-sm text-gray-txt-50 mb-2 md:hidden">
              URH: {urhExamples[index]?.sentence}
            </p>
          )}

          <div key={index} className="flex flex-col gap-2 w-full">
            <BaseInput
              key={index}
              placeholder={`${t("common.dictionary.example", "Example")} ${index + 1}`}
              value={example.sentence}
              setValue={(value: string | number) =>
                setData((prev) => ({
                  ...prev,
                  examples: prev.examples.map((ex, i) =>
                    i === index ? { ...ex, sentence: value as string } : ex,
                  ),
                }))
              }
            />

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <PermissionGate permission="add_media">
              <StagedMediaButton
                kind="audio"
                label={
                  example.audioUrl
                    ? t("common.dictionary.updateAudio", "Update Audio")
                    : t("common.dictionary.uploadAudio", "Upload Audio")
                }
                onUploaded={(value) =>
                  setData((prev) => ({
                    ...prev,
                    examples: prev.examples.map((ex, i) =>
                      i === index ? { ...ex, audioUrl: value } : ex,
                    ),
                  }))
                }
              />
              </PermissionGate>

              {example.audioUrl && (
                <PlayAudioButton audioUrl={example.audioUrl} />
              )}

              {data.examples.length > 1 && (
                <Trash2
                  onClick={() => {
                    setData((prev) => ({
                      ...prev,
                      examples: prev.examples.filter((_, i) => i !== index),
                    }));
                  }}
                  className="text-red-500 cursor-pointer"
                  strokeWidth={1.4}
                  size={20}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => {
          setData((prev) => ({
            ...prev,
            examples: [...prev.examples, { sentence: "", audioUrl: "" }],
          }));
        }}
        className="secondary-btn px-10"
      >
        {t("common.dictionary.addAnotherExample", "Add another example")}
      </button>
    </>
  );
};

export default SenseCardExamples;
