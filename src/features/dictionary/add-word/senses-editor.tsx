"use client";

import React from "react";
import SensesSection from "./sense-form-columns";
import SenseDetails from "./saved-sense-card";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useAddWordWizard } from "./contexts/AddWordWizardContext";
import { useSensesDraft } from "./senses/useSensesDraft";
import { useSensesSubmit } from "./senses/useSensesSubmit";

const SensesWrapper = () => {
  const { data } = useAddWordWizard();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const {
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
  } = useSensesDraft({ ota: data.ota });
  const { handleSubmit: submitSenses } = useSensesSubmit();

  const getSenseErrorKey = (msg: string) => {
    if (msg === "Please enter the Urhobo word") return "common.dictionary.enterWord";
    if (msg === "Please enter the Urhobo part of speech")
      return "common.dictionary.partOfSpeech";
    if (msg === "Please enter the Urhobo meaning") return "common.dictionary.meaning";
    if (msg === "Please enter the Urhobo pronunciation")
      return "common.dictionary.pronunciation";
    if (msg === "Please enter the Urhobo IPA") return "common.dictionary.ipa";
    if (msg === "Please enter the Urhobo examples") return "common.dictionary.examples";
    if (msg === "Please enter the English word") return "common.dictionary.enterWord";
    if (msg === "Please enter the English part of speech")
      return "common.dictionary.partOfSpeech";
    if (msg === "Please enter the English meaning") return "common.dictionary.meaning";
    if (msg === "Please enter the English pronunciation")
      return "common.dictionary.pronunciation";
    if (msg === "Please enter the English IPA") return "common.dictionary.ipa";
    if (msg === "Please enter the English examples") return "common.dictionary.examples";
    if (msg === "Please enter the Korean part of speech")
      return "common.dictionary.partOfSpeech";
    if (msg === "Please enter the Korean meaning") return "common.dictionary.meaning";
    if (msg === "Please enter the Korean pronunciation")
      return "common.dictionary.pronunciation";
    if (msg === "Please enter the Korean IPA") return "common.dictionary.ipa";
    if (msg === "Please enter the Korean examples") return "common.dictionary.examples";
    if (msg === "Please enter the same number of examples for urhobo and english")
      return "common.dictionary.examples";
    if (msg === "Please enter the same number of examples for urhobo and korean")
      return "common.dictionary.examples";
    return "common.dictionary.enterWord";
  };

  const handleSubmit = () => {
    const hasUnsavedDraft = [urhData, engData, korData].some(
      (draft) => draft.meaning.trim() !== "",
    );
    if (hasUnsavedDraft) {
      const draftMsg =
        "You have an unsaved sense. Save it or clear the form before continuing.";
      toast.error(t("common.dictionary.unsavedSense", draftMsg));
      setError(draftMsg);
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    submitSenses();
  };

  return (
    <div className="flex flex-col dark-box md:px-4 px-0 w-full pb-20">
      <div className="flex items-center justify-between gap-4 md:px-5">
        <h2 className="text-white font-medium text-lg">
          {t("common.dictionary.addSenses", "Add Senses")}
        </h2>

        {senses.length > 0 && (
          <button
            onClick={handleSubmit}
            className="primary-btn font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("common.dictionary.continue", "Continue")}
          </button>
        )}
      </div>

      <div ref={buttonRef} className="flex flex-col gap-2 mt-5">
        {senses.map((sense, i) => (
          <SenseDetails
            key={i}
            ota={data.ota}
            editSense={(s) => editSense(s, i)}
            sense={sense}
          />
        ))}
      </div>

      <div ref={errorRef} className="w-full">
        {error && (
          <div className="flex items-center max-md:mb-4 justify-center w-fit mx-auto gap-5 text-base-red border border-dashed border-base-red rounded-full mt-4 py-3 px-5 bg-red-500/10">
            <p className=" text-center">{t(getSenseErrorKey(error), error)}</p>

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
        {t("common.dictionary.saveSense", "Save This Sense")}
      </button>
    </div>
  );
};

export default SensesWrapper;
