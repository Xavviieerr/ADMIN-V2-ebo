import {
  AudioInput,
  BaseInput,
  BaseTextArea,
} from "@/features/shared";
import React from "react";
import { engPos, korPos, SenseData, urhPos } from "@/features/dictionary/lib";

type SenseCardMetaProps = {
  lang: "urh" | "eng" | "kor";
  data: SenseData;
  setData: React.Dispatch<React.SetStateAction<SenseData>>;
  ota: string;
};

const SenseCardMeta = ({ lang, data, setData, ota }: SenseCardMetaProps) => {
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
    <>
      <div className="flex items-center gap-3 text-base font-medium">
        <h2>
          {lang === "urh"
            ? "Urhobo Sense"
            : lang === "kor"
              ? "Korean Translation"
              : "English Translation"}
        </h2>
      </div>

      <div className="flex flex-col w-full gap-4">
        <div className="flex max-md:flex-col items-center gap-4">
          {lang === "urh" && (
            <AudioInput
              disabled
              input={ota}
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
              setValue={(value) =>
                setData({ ...data, IPA: value as string })
              }
              placeholder="IPA"
            />
          </div>

          <BaseTextArea
            value={data.meaning}
            setValue={(value) =>
              setData({ ...data, meaning: value as string })
            }
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
      </div>
    </>
  );
};

export default SenseCardMeta;
