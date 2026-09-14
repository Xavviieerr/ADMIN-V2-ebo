"use client";

import React, { useState } from "react";
import { SingleWord } from "@/features/dictionary/lib";
import { CheckCheck, MessageCircle, PenBox } from "lucide-react";
import { useSingleWordContext } from "./context";
import { KeyValueParagraph } from "@/features/shared";
import PlayAudioButton from "./play-audio";
import AudioUploader from "./audio-uploader";
import DeleteAudioButton from "./delete-audio";
import { DeleteTranslationButton } from "./buttons";
import { AddTranslationForm } from "./forms";
import PermissionGate from "@/features/shared/permission-gate";

const TranslationList = ({ data }: { data: SingleWord }) => {
  const { lang } = useSingleWordContext();
  const [view, setView] = useState<"view" | "add">("view");
  const [selected, setSelected] = useState<SingleWord["efaEng"][number]>();
  const [transIndex, setTransIndex] = useState<number>();

  const getTranslations = () => {
    if (lang === "Korean") return data.efaKor;
    return data.efaEng;
  };

  if (view === "add" || (selected && transIndex != undefined)) {
    return (
      <AddTranslationForm
        selected={selected}
        type={selected ? "edit" : "add"}
        transIndex={transIndex}
        onClose={() => {
          setSelected(undefined);
          setView("view");
          setTransIndex(undefined);
        }}
      />
    );
  }

  const items = [];

  for (let transIndex = 0; transIndex < data.oho.length; transIndex++) {
    const translation = getTranslations().find(
      (translation) => translation.kere === transIndex + 1,
    );

    if (!translation || !translation.otaWord) {
      items.push(
        <div
          key={transIndex}
          className="flex flex-col items-center justify-center input py-7 gap-4 my-10"
        >
          <p>
            No {lang} translations found for Kere {transIndex + 1}
          </p>
          <PermissionGate permission="add_word">
            <button
              onClick={() => {
                if (!translation) {
                  setView("add");
                  return;
                }

                setSelected(translation);
                setTransIndex(transIndex + 1);
              }}
              className="secondary-btn px-10 flex items-center gap-3 py-2"
            >
              <PenBox width={16} /> Add
            </button>
          </PermissionGate>
        </div>,
      );
    } else {
      items.push(
        <div
          key={transIndex}
          className="input flex flex-col gap-3 py-5 font-normal relative"
        >
          <div className="flex max-md:flex-col-reverse items-center  justify-between gap-2">
            <div className="flex justify-between max-md:w-full max-md:mt-4 items-center gap-6 text-lg md:text-2xl leading-none">
              <p className="">
                <span>{translation.otaWord}</span>
              </p>

              <div className="flex items-center gap-4">
                {translation.details.omra?.length > 0 && (
                  <PlayAudioButton
                    audioUrl={translation.details.omra[0]}
                    size={24}
                  />
                )}

                {(!translation.details.omra ||
                  translation.details.omra.length == 0) && (
                  <AudioUploader
                    type="translation"
                    payload={{
                      translationId: translation.id,
                      translationIndex: transIndex + 1,
                      languageType: lang.toLowerCase(),
                    }}
                  />
                )}

                {translation.details.omra?.length > 0 && (
                  <DeleteAudioButton
                    type="translation"
                    payload={JSON.stringify({
                      translationId: translation.id,
                      translationIndex: transIndex + 1,
                      languageType: lang.toLowerCase(),
                      removeUrl: translation.details.omra[0],
                    })}
                  />
                )}
              </div>
            </div>

            <PermissionGate permission="add_word">
              <div className="flex max-md:justify-between items-center gap-2 border-b md:w-fit pb-2 border-gray-txt-50/50 w-full justify-end">
                <button
                  title="Approve Translation"
                  className="text-base-green px-2 text-sm cursor-pointer rounded-md"
                >
                  <CheckCheck size={26} />
                </button>
                <button
                  title="Edit Translation"
                  onClick={() => {
                    setSelected(translation);
                    setTransIndex(transIndex + 1);
                  }}
                  className="text-foreground-50 px-2 text-sm cursor-pointer rounded-md"
                >
                  <PenBox />
                </button>

                <button
                  title="Leave Comment"
                  className="text-gray-txt-50 px-2 text-sm cursor-pointer rounded-md"
                >
                  <MessageCircle />
                </button>

                <DeleteTranslationButton
                  payload={{
                    translationId: translation.id,
                    translationIndex: transIndex + 1,
                    languageType: lang.toLowerCase(),
                  }}
                  size={24}
                />
              </div>
            </PermissionGate>
          </div>

          <div className="flex flex-col md:flex-row w-full items-start justify-between gap-4">
            <div className="w-full md:w-1/2 flex flex-col gap-3 md:pr-5">
              <KeyValueParagraph
                item="Pronunciation"
                value={`[${translation.details.upho}]`}
              />
              <KeyValueParagraph
                item="IPA"
                value={`/ ${translation.details.uphoesio} /`}
              />

              <KeyValueParagraph
                item="Part of Speech"
                value={translation.details.ekerota.join(", ")}
              />

              {translation.details.ibuebu?.length > 0 && (
                <KeyValueParagraph
                  item="Plurals"
                  value={translation.details.ibuebu.join(", ")}
                />
              )}

              {translation.details.okpo?.length > 0 && (
                <KeyValueParagraph
                  item="Synonyms"
                  value={translation.details.okpo.map((s) => s.ota).join(", ")}
                />
              )}

              {translation.details.orhan?.length > 0 && (
                <KeyValueParagraph
                  item="Antonyms"
                  value={translation.details.orhan.join(", ")}
                />
              )}

              {translation.details.ekaeruo?.length > 0 && (
                <KeyValueParagraph
                  item="Related Words"
                  value={translation.details.ekaeruo.join(", ")}
                />
              )}

              <KeyValueParagraph
                item="Meaning"
                value={translation.details.oto}
                col
              />
            </div>

            <div className="flex flex-col md:pl-5 md:border-l max-md:border-t max-md:pt-5 border-gray-txt-50 md:w-1/2 w-full gap-3 max-md:text-sm">
              <p>Examples</p>
              <div className="text-gray-txt-50 ml-4 italic flex flex-col gap-2">
                {translation.details.idje.map((ex, i) => (
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
                          translationIndex: transIndex + 1,
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
        </div>,
      );
    }
  }

  return <>{items}</>;
};

export default TranslationList;
