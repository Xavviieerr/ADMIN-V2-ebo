"use client";
import {
  AudioInput,
  BaseInput,
  BaseTextArea,
  MultiInput,
} from "@/features/shared";
import { Trash2 } from "lucide-react";
import React from "react";
import SynonymInput from "./synonym-input";
import { engPos, korPos, SenseData, urhPos } from "@/features/dictionary/lib";
import { useWordContext } from "./context";

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
  const { data: wordData } = useWordContext();
  const getPos = () => {
    if (lang === "eng") {
      return engPos;
    }
    if (lang === "kor") {
      return korPos;
    }
    return urhPos;
  };

  return (
    <div className="dark-box px-4 md:w-[47%] w-full shrink-0">
      <div className="flex items-center gap-3 text-base font-medium">
        <h2>
          {lang === "urh"
            ? "Urhobo Sense"
            : lang === "kor"
              ? "Korean Translation"
              : "English Translation"}
        </h2>
      </div>

      <div className="flex flex-col w-full gap-4 mt-4">
        <div className="flex max-md:flex-col items-center gap-4">
          {lang === "urh" && (
            <AudioInput
              disabled
              input={wordData.ota}
              setValue={() => {}}
              setAudio={(value) => setData({ ...data, audioUrl: value })}
            />
          )}

          {lang !== "urh" && (
            <AudioInput
              input={data.headWord}
              placeholder="Enter the word's translation"
              setValue={(value) => setData({ ...data, headWord: value })}
              setAudio={(value) => setData({ ...data, audioUrl: value })}
            />
          )}
        </div>

        <select
          value={data.partOfSpeech}
          onChange={(e) => setData({ ...data, partOfSpeech: e.target.value })}
          id="pos"
          className="input h-12 capitalize bg-secondary-bg"
        >
          {getPos().map((pos) => (
            <option
              key={pos}
              value={pos}
              className="text-white bg-secondary-bg capitalize"
            >
              {pos}
            </option>
          ))}
        </select>

        <>
          <div className="flex max-md:flex-col items-center gap-4">
            <BaseInput
              value={data.pronunciation}
              setValue={(value) =>
                setData({ ...data, pronunciation: value as string })
              }
              placeholder="Pronunciation"
            />

            <BaseInput
              value={data.IPA}
              setValue={(value) => setData({ ...data, IPA: value as string })}
              placeholder="IPA"
            />
          </div>

          <BaseTextArea
            value={data.meaning}
            setValue={(value) => setData({ ...data, meaning: value as string })}
            placeholder="Meaning of the word"
          />

          <BaseInput
            value={data.scientificName}
            setValue={(value) =>
              setData({ ...data, scientificName: value as string })
            }
            placeholder="Scientific Name"
          />
        </>

        {/* Plurals, Synonyms, Antonyms, Related Words */}
        <>
          <MultiInput
            placeholder="Plural forms of the word"
            values={data.plurals}
            removeValue={(value) =>
              setData({
                ...data,
                plurals: data.plurals.filter((t) => t !== value),
              })
            }
            addValue={(value) =>
              setData({
                ...data,
                plurals: [...data.plurals, value],
              })
            }
          />

          <SynonymInput
            placeholder="Synonyms of the word"
            values={data.synonyms.map((t) => t.ota)}
            removeValue={(value) =>
              setData({
                ...data,
                synonyms: data.synonyms.filter((t) => t.ota !== value),
              })
            }
            addValue={(value) =>
              setData({
                ...data,
                synonyms: [...data.synonyms, value],
              })
            }
          />

          <MultiInput
            placeholder="Antonyms of the word"
            values={data.antonyms}
            removeValue={(value) =>
              setData({
                ...data,
                antonyms: data.antonyms.filter((t) => t !== value),
              })
            }
            addValue={(value) =>
              setData({
                ...data,
                antonyms: [...data.antonyms, value],
              })
            }
          />

          <MultiInput
            placeholder="Related words"
            values={data.relatedWords}
            removeValue={(value) =>
              setData({
                ...data,
                relatedWords: data.relatedWords.filter((t) => t !== value),
              })
            }
            addValue={(value) =>
              setData({
                ...data,
                relatedWords: [...data.relatedWords, value],
              })
            }
          />
        </>

        <hr className="border border-gray-txt-100/50 h-px my-4" />

        {/* Examples */}
        <>
          <h2>
            {lang === "urh"
              ? "Urhobo Examples"
              : lang === "kor"
                ? "Korean Examples"
                : "English Examples"}
          </h2>

          {data.examples.map((example, index) => (
            <div key={index} className="flex flex-col">
              {urhExamples && index < urhExamples.length && (
                <p className="font-medium text-sm text-gray-txt-50 mb-2 md:hidden">
                  URH: {urhExamples[index]?.sentence}
                </p>
              )}

              <div key={index} className="flex items-center gap-4 w-full">
                <AudioInput
                  key={index}
                  placeholder={`Example ${index + 1}`}
                  input={example.sentence}
                  setValue={(value) =>
                    setData((prev) => ({
                      ...prev,
                      examples: prev.examples.map((ex, i) =>
                        i === index ? { ...ex, sentence: value } : ex,
                      ),
                    }))
                  }
                  setAudio={(value) =>
                    setData((prev) => ({
                      ...prev,
                      examples: prev.examples.map((ex, i) =>
                        i === index ? { ...ex, audioUrl: value } : ex,
                      ),
                    }))
                  }
                />

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
            Add another example
          </button>
        </>
      </div>
    </div>
  );
};

export default SenseCard;
