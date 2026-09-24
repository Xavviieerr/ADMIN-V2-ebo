"use client";
import { GoBackButton } from "@/features/shared";
import { useRouter } from "next/navigation";
import React from "react";
import SensesWrapper from "./senses-editor";
import WordDetailsForm from "./word-details-form";
import Preview from "./preview";
import { useAddWordWizard } from "./contexts/AddWordWizardContext";
import {
  useWizardStep,
  type WizardStep,
} from "@/features/dictionary/add-word/hooks/useWizardStep";
import { validateWordDetails } from "@/features/dictionary/add-word/validate-word";

const PageSwitcher = ({
  dialects,
}: {
  dialects: { name: string; id: string }[];
}) => {
  const { data, senses } = useAddWordWizard();
  const { step, goStep } = useWizardStep();

  const router = useRouter();

  const handleBack = () => {
    if (step === "preview") return goStep("senses");
    if (step === "senses") return goStep("details");
    return router.push("/guonopedia/dictionary");
  };

  const effectiveStep: WizardStep = (() => {
    if (step === "senses" && validateWordDetails(data)) return "details";
    if (step === "preview" && senses.length === 0) return "senses";
    return step;
  })();

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white font-plus-sans">
      <GoBackButton onClick={handleBack} />

      {effectiveStep === "details" ? (
        <WordDetailsForm dialects={dialects} />
      ) : effectiveStep === "senses" ? (
        <SensesWrapper />
      ) : (
        <Preview />
      )}
    </div>
  );
};

export default PageSwitcher;
