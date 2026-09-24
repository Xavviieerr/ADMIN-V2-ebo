"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { SenseData } from "@/features/dictionary/lib";
import { validateSenseDetails } from "@/features/dictionary/add-word/validate-word";
import { useAddWordWizard } from "../contexts/AddWordWizardContext";

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

export function useSensesDraft({ ota }: { ota: string }) {
  const { senses, setSenses } = useAddWordWizard();

  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [urhData, setUrhData] = useState({
    ...defaultVal,
    headWord: ota,
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
    setUrhData({ ...defaultVal, headWord: ota, partOfSpeech: "Odẹ" });
    setEngData({ ...defaultVal, partOfSpeech: "Noun" });
    setKorData({ ...defaultVal, partOfSpeech: "명사" });
  };

  const editSense = (
    sense: {
      urhData: SenseData;
      engData: SenseData;
      korData: SenseData;
    },
    index: number,
  ) => {
    setUrhData(sense.urhData);
    setEngData(sense.engData);
    setKorData(sense.korData);
    setSenses(senses.filter((_, idx) => idx !== index));
  };

  return {
    senses,
    error,
    setError,
    errorRef,
    buttonRef,
    urhData,
    setUrhData,
    engData,
    setEngData,
    korData,
    setKorData,
    saveSense,
    editSense,
  };
}
