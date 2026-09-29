"use client";

import React from "react";
import { Oho } from "@/features/dictionary/lib";
import { PenBox } from "lucide-react";
import { useWizardStep } from "@/features/dictionary/add-word/hooks/useWizardStep";
import { KeyValueParagraph } from "@/features/shared";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const TranslationList = ({
  translations,
  lang,
}: {
  translations: Oho["translations"]["eng"][] | Oho["translations"]["kor"][];
  lang: "English" | "Korean";
}) => {
  const { goStep } = useWizardStep();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  return (
    translations &&
    translations.length > 0 &&
    translations.map((translation, i) => {
      if (!translation)
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center input py-7 gap-4 my-10"
          >
            <p>{t("common.dictionary.noTranslations", `No ${lang} Translations Found`)}</p>
            <button
              onClick={() => goStep("senses")}
              className="secondary-btn px-10 flex items-center gap-3 py-2"
            >
              <PenBox width={16} /> {t("common.add", "Add")}
            </button>
          </div>
        );

      return (
        <div
          key={i}
          className="input flex max-md:flex-col gap-3 py-5 font-normal"
        >
          <div className="md:w-1/2 w-full flex flex-col gap-3 md:pr-5">
            <KeyValueParagraph item={t("common.dictionary.wordTranslationLabel", "Head Word")} value={translation.ota} />

            <KeyValueParagraph item={t("common.dictionary.pronunciation", "Pronunciation")} value={translation.upho} />

            <KeyValueParagraph item={t("common.dictionary.ipa", "IPA")} value={translation.uphoesio} />

            <KeyValueParagraph item={t("common.dictionary.meaning", "Meaning")} value={translation.oto} col />

            <KeyValueParagraph
              item={t("common.dictionary.partOfSpeech", "Part of Speech")}
              value={translation.ekerota.join(", ")}
            />

            {translation.ibuebu.length > 0 && (
              <KeyValueParagraph
                item={t("common.dictionary.plurals", "Plurals")}
                value={translation.ibuebu.join(", ")}
              />
            )}

            {translation.okpo.length > 0 && (
              <KeyValueParagraph
                item={t("common.dictionary.synonyms", "Synonyms")}
                value={translation.okpo.map((item) => item.ota).join(", ")}
              />
            )}

            {translation.orhan.length > 0 && (
              <KeyValueParagraph
                item={t("common.dictionary.antonyms", "Antonyms")}
                value={translation.orhan.join(", ")}
              />
            )}

            {translation.ekaeruo.length > 0 && (
              <KeyValueParagraph
                item={t("common.dictionary.relatedWords", "Related Words")}
                value={translation.ekaeruo.join(", ")}
              />
            )}
          </div>

          <div className="flex flex-col md:pl-5 md:border-l max-md:border-t max-md:pt-5 border-gray-txt-50 md:w-1/2 w-full gap-3 max-md:text-sm">
            <p>{t("common.dictionary.examples", "Examples")}</p>
            <ul className="text-gray-txt-50 ml-4 italic flex flex-col gap-2">
              {translation.idje.map((ex, i) => (
                <li key={i}>
                  {i + 1}. {ex.sentence}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    })
  );
};

export default TranslationList;
