"use client";

import React from "react";
import { PayloadData } from "@/features/dictionary/lib";
import { KeyValueParagraph } from "@/features/shared";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const SensesList = ({ data }: { data: PayloadData }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  return data.oho.map((sense, i) => (
    <div key={i} className="input flex max-md:flex-col gap-3 py-7 font-normal">

      <div className="md:w-1/2 w-full flex flex-col gap-3 md:pr-5">
        <KeyValueParagraph item={t("common.dictionary.pronunciation", "Pronunciation")} value={sense.upho} />

        <KeyValueParagraph item={t("common.dictionary.ipa", "IPA")} value={sense.uphoesio} />

        <KeyValueParagraph item={t("common.dictionary.meaning", "Meaning")} value={sense.oto} col />

        <KeyValueParagraph
          item={t("common.dictionary.partOfSpeech", "Part of Speech")}
          value={sense.ekerota.join(", ")}
        />

        {sense.ibuebu.length > 0 && (
          <KeyValueParagraph item={t("common.dictionary.plurals", "Plurals")} value={sense.ibuebu.join(", ")} />
        )}

        {sense.okpo.length > 0 && (
          <KeyValueParagraph
            item={t("common.dictionary.synonyms", "Synonyms")}
            value={sense.okpo.map((item) => item.ota).join(", ")}
          />
        )}

        {sense.orhan.length > 0 && (
          <KeyValueParagraph item={t("common.dictionary.antonyms", "Antonyms")} value={sense.orhan.join(", ")} />
        )}

        {sense.ekaeruo.length > 0 && (
          <KeyValueParagraph
            item={t("common.dictionary.relatedWords", "Related Words")}
            value={sense.ekaeruo.join(", ")}
          />
        )}
      </div>

      <div className="flex flex-col md:pl-5 md:border-l max-md:border-t max-md:pt-5 border-gray-txt-50 md:w-1/2 w-full gap-3 max-md:text-sm">
        <p>{t("common.dictionary.examples", "Examples")}</p>
        <ul className="text-gray-txt-50 ml-4 italic flex flex-col gap-2">
          {sense.idje.map((ex, i) => (
            <li key={i}>
              {i + 1}. {ex.sentence}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ));
};

export default SensesList;
