"use client";

import React from "react";
import { SingleWord } from "@/features/dictionary/lib";
import { PenBox } from "lucide-react";
import { KeyValueParagraph } from "@/features/shared";
import PlayAudioButton from "./play-audio";
import AudioUploader from "./audio-uploader";
import DeleteAudioButton from "./delete-audio";
import PermissionGate from "@/features/shared/permission-gate";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const TranslationCard = ({
  translation,
  transIndex,
  lang,
  onEdit,
  sense,
  ota,
}: {
  translation: SingleWord["efaEng"][number];
  transIndex: number;
  lang: string;
  onEdit: () => void;
  sense?: SingleWord["oho"][number];
  ota?: string;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  return (
    <div
      key={transIndex}
      className="input flex flex-col gap-3 py-5 font-normal relative"
    >
      {sense && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rounded-full bg-yellow-500/15 text-yellow-400 px-3 py-1 text-xs font-medium uppercase">
            {t("common.dictionary.senseCount", "Sense")} {sense.kere}
          </span>
          {ota && <span className="font-medium">{ota}</span>}
          {sense.oto && (
            <span className="text-sm text-gray-txt-50">“{sense.oto}”</span>
          )}
        </div>
      )}
      <div className="flex max-md:flex-col-reverse items-center  justify-between gap-2">
        <div className="flex justify-between max-md:w-full max-md:mt-4 items-center gap-6 text-lg md:text-2xl leading-none">
          <p className="">
            <span>{translation.otaWord}</span>
          </p>

          <div className="flex items-center gap-4">
            {translation.details?.omra?.length > 0 && (
              <PlayAudioButton
                audioUrl={translation.details.omra[0]}
                size={24}
              />
            )}

            {(!translation.details?.omra ||
              translation.details.omra.length == 0) && (
              <AudioUploader
                type="translation"
                payload={{
                  translationId: translation.id,
                  translationIndex: translation.kere,
                  languageType: lang.toLowerCase(),
                }}
              />
            )}

            {translation.details?.omra?.length > 0 && (
              <DeleteAudioButton
                type="translation"
                payload={{
                  translationId: translation.id,
                  translationIndex: translation.kere,
                  languageType: lang.toLowerCase(),
                  removeUrl: translation.details.omra[0],
                }}
              />
            )}
          </div>
        </div>

        <div className="flex max-md:justify-between items-center gap-2 border-b md:w-fit pb-2 border-gray-txt-50/50 w-full justify-end">
          <PermissionGate permission="add_word">
            <button
              title={t("common.dictionary.editTranslation", "Edit Translation")}
              aria-label={t("common.dictionary.editTranslation", "Edit Translation")}
              onClick={onEdit}
              className="text-foreground-50 px-2 text-sm cursor-pointer rounded-md flex items-center gap-1"
            >
              <PenBox size={16} />
              <span className="text-xs font-medium">{t("common.edit", "Edit")}</span>
            </button>
          </PermissionGate>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full items-start justify-between gap-4">
        <div className="w-full md:w-1/2 flex flex-col gap-3 md:pr-5">
          <KeyValueParagraph
            item={t("common.dictionary.pronunciation", "Pronunciation")}
            value={`[${translation.details?.upho ?? ""}]`}
          />
          <KeyValueParagraph
            item={t("common.dictionary.ipa", "IPA")}
            value={`/ ${translation.details?.uphoesio ?? ""} /`}
          />

          <KeyValueParagraph
            item={t("common.dictionary.partOfSpeech", "Part of Speech")}
            value={(translation.details?.ekerota ?? []).join(", ")}
          />

          {translation.details?.ibuebu && translation.details.ibuebu.length > 0 && (
            <KeyValueParagraph
              item={t("common.dictionary.plurals", "Plurals")}
              value={translation.details.ibuebu.join(", ")}
            />
          )}

          {translation.details?.okpo && translation.details.okpo.length > 0 && (
            <KeyValueParagraph
              item={t("common.dictionary.synonyms", "Synonyms")}
              value={translation.details.okpo.map((s) => s.ota).join(", ")}
            />
          )}

          {translation.details?.orhan && translation.details.orhan.length > 0 && (
            <KeyValueParagraph
              item={t("common.dictionary.antonyms", "Antonyms")}
              value={translation.details.orhan.join(", ")}
            />
          )}

          {translation.details?.ekaeruo && translation.details.ekaeruo.length > 0 && (
            <KeyValueParagraph
              item={t("common.dictionary.relatedWords", "Related Words")}
              value={translation.details.ekaeruo.join(", ")}
            />
          )}

          <KeyValueParagraph
            item={t("common.dictionary.meaning", "Meaning")}
            value={translation.details?.oto ?? ""}
            col
          />
        </div>

        <div className="flex flex-col md:pl-5 md:border-l max-md:border-t max-md:pt-5 border-gray-txt-50 md:w-1/2 w-full gap-3 max-md:text-sm">
          <p>{t("common.dictionary.examples", "Examples")}</p>
          <div className="text-gray-txt-50 ml-4 italic flex flex-col gap-2">
            {(translation.details?.idje ?? []).map((ex, i) => (
              <div
                className="flex items-center justify-between gap-4"
                key={i}
              >
                <span>
                  {i + 1}. {ex.sentence}
                </span>

                <div className="flex items-center gap-2">
                  {ex.audioUrl && (
                    <PlayAudioButton audioUrl={ex.audioUrl} size={22} />
                  )}

                  <AudioUploader
                    type="translationExample"
                    payload={{
                      translationId: translation.id,
                      translationIndex: translation.kere,
                      languageType: lang.toLowerCase(),
                      exampleSentenceIndex: i + 1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationCard;
