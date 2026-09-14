"use client";

import React, { useRef, useState } from "react";
import SensesSection from "./senses-section";
import SenseDetails from "./sense-details";
import { SenseData } from "@/features/dictionary/lib";
import {
  formatSenses,
  validateSenseDetails,
} from "@/features/dictionary/lib/helpers";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useWordContext } from "./context";

const defaultVal: SenseData = {
  headWord: "",
  audioUrl: "",
  partOfSpeech: "",
  meaning: "",
  pronunciation: "",
  IPA: "",
  scientificName: "",
  plurals: [] as string[],
  synonyms: [] as { ota: string; egba: string }[],
  antonyms: [] as string[],
  relatedWords: [] as string[],
  examples: [{ sentence: "", audioUrl: "" }],
};

const SensesWrapper = () => {
  const { data, setData, senses, setSenses, setPage } = useWordContext();

  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [urhData, setUrhData] = useState({
    ...defaultVal,
    headWord: data.ota,
    partOfSpeech: "Odẹ",
  });
  const [engData, setEngData] = useState({
    ...defaultVal,
    partOfSpeech: "Noun",
  });
  const [korData, setKorData] = useState({
    ...defaultVal,
    partOfSpeech: "명사",
  });

  const saveSense = () => {
    const res = validateSenseDetails({ urhData, engData, korData });

    if (res) {
      toast.error(res);
      setError(res);
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    buttonRef.current?.scrollIntoView({ behavior: "smooth" });

    setError("");
    setSenses([...senses, { urhData, engData, korData }]);
    setUrhData(defaultVal);
    setEngData(defaultVal);
    setKorData(defaultVal);
  };

  const editSense = (sense: {
    urhData: SenseData;
    engData: SenseData;
    korData: SenseData;
  }) => {
    setUrhData(sense.urhData);
    setEngData(sense.engData);
    setKorData(sense.korData);
    setSenses(
      senses.filter((item) => item.urhData.headWord !== sense.urhData.headWord),
    );
  };

  const handleSubmit = () => {
    const oho = senses.map((sense, index) => {
      return formatSenses({
        image: data.image,
        index: index + 1,
        urh: sense.urhData,
        eng: sense.engData,
        kor: sense.korData,
      });
    });
    setData((prev) => ({ ...prev, oho }));

    setPage("preview");
  };

  return (
    <div className="flex flex-col dark-box md:px-4 px-0 w-full pb-20">
      <div className="flex items-center justify-between gap-4 md:px-5">
        <h2 className="text-white font-medium text-lg">Add Senses</h2>

        {senses.length > 0 && (
          <button
            onClick={handleSubmit}
            className="primary-btn font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        )}
      </div>

      <div ref={buttonRef} className="flex flex-col gap-2 mt-5">
        {senses.map((sense, i) => (
          <SenseDetails
            key={i}
            ota={data.ota}
            editSense={editSense}
            sense={sense}
            length={senses.length}
          />
        ))}
      </div>

      <div ref={errorRef} className="w-full">
        {error && (
          <div className="flex items-center max-md:mb-4 justify-center w-fit mx-auto gap-5 text-base-red border border-dashed border-base-red rounded-full mt-4 py-3 px-5 bg-red-500/10">
            <p className=" text-center">{error}</p>

            <X onClick={() => setError("")} className="" />
          </div>
        )}
      </div>

      <SensesSection
        urhData={urhData}
        engData={engData}
        korData={korData}
        setUrhData={setUrhData}
        setEngData={setEngData}
        setKorData={setKorData}
      />

      <button onClick={saveSense} className="primary-btn  px-20 self-center">
        Save This Sense
      </button>
    </div>
  );
};

export default SensesWrapper;
