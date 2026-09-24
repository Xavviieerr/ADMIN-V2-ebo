"use client";
import React from "react";
import { SenseData } from "@/features/dictionary/lib";
import { useAddWordWizard } from "./contexts/AddWordWizardContext";
import { LexicalFields } from "@/features/dictionary/shared";
import SenseCardExamples from "./sense-card-examples";
import SenseCardMeta from "./sense-card-meta";

const SenseCard = ({
  lang = "urh",
  data,
  setData,
  urhExamples,
}: {
  lang?: "urh" | "eng" | "kor";
  data: SenseData;
  setData: React.Dispatch<React.SetStateAction<SenseData>>;
  urhExamples?: SenseData["examples"];
}) => {
  const { data: wordData } = useAddWordWizard();

  return (
    <div className="dark-box px-4 md:w-[47%] w-full shrink-0">
      <SenseCardMeta lang={lang} data={data} setData={setData} ota={wordData.ota} />

      <div className="flex flex-col w-full gap-4 mt-4">
        {/* Plurals, Synonyms, Antonyms, Related Words */}
        <LexicalFields
          values={{
            ibuebu: data.plurals,
            okpo: data.synonyms,
            orhan: data.antonyms,
            ekaeruo: data.relatedWords,
          }}
          onChange={(patch) =>
            setData({
              ...data,
              plurals: patch.ibuebu ?? data.plurals,
              synonyms: patch.okpo ?? data.synonyms,
              antonyms: patch.orhan ?? data.antonyms,
              relatedWords: patch.ekaeruo ?? data.relatedWords,
            })
          }
        />

        <hr className="border border-gray-txt-100/50 h-px my-4" />

        {/* Examples */}
        <SenseCardExamples
          lang={lang}
          data={data}
          setData={setData}
          urhExamples={urhExamples}
        />
      </div>
    </div>
  );
};

export default SenseCard;
