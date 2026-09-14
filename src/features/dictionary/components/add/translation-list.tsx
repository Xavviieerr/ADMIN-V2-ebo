"use client";

import React from "react";
import { Oho } from "@/features/dictionary/lib";
import { PenBox } from "lucide-react";
import { useWordContext } from "./context";
import { KeyValueParagraph } from "@/features/shared";

const TranslationList = ({
  translations,
  lang,
}: {
  translations: Oho["translations"]["eng"][] | Oho["translations"]["kor"][];
  lang: "English" | "Korean";
}) => {
  const { setPage } = useWordContext();
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
            <p>No {lang} Translations Found</p>
            <button
              onClick={() => setPage("senses")}
              className="secondary-btn px-10 flex items-center gap-3 py-2"
            >
              <PenBox width={16} /> Add
            </button>
          </div>
        );

      return (
        <div
          key={i}
          className="input flex max-md:flex-col gap-3 py-5 font-normal"
        >
          {/* <p>{i + 1}</p> */}
          <div className="md:w-1/2 w-full flex flex-col gap-3 md:pr-5">
            <KeyValueParagraph item="Head Word" value={translation.ota} />

            <KeyValueParagraph item="Pronunciation" value={translation.upho} />

            <KeyValueParagraph item="IPA" value={translation.uphoesio} />

            <KeyValueParagraph item="Meaning" value={translation.oto} col />

            <KeyValueParagraph
              item="Part of Speech"
              value={translation.ekerota.join(", ")}
            />

            {translation.ibuebu.length > 0 && (
              <KeyValueParagraph
                item="Plurals"
                value={translation.ibuebu.join(", ")}
              />
            )}

            {translation.okpo.length > 0 && (
              <KeyValueParagraph
                item="Synonyms"
                value={translation.okpo.map((item) => item.ota).join(", ")}
              />
            )}

            {translation.orhan.length > 0 && (
              <KeyValueParagraph
                item="Antonyms"
                value={translation.orhan.join(", ")}
              />
            )}

            {translation.ekaeruo.length > 0 && (
              <KeyValueParagraph
                item="Related Words"
                value={translation.ekaeruo.join(", ")}
              />
            )}
          </div>

          <div className="flex flex-col md:pl-5 md:border-l max-md:border-t max-md:pt-5 border-gray-txt-50 md:w-1/2 w-full gap-3 max-md:text-sm">
            <p>Examples</p>
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
