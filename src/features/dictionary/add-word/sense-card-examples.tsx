import React from "react";
import { AudioInput } from "@/features/shared";
import { Trash2 } from "lucide-react";
import { SenseData } from "@/features/dictionary/lib";

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
  return (
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
  );
};

export default SenseCardExamples;
