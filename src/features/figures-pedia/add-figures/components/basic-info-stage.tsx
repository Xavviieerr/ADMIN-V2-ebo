"use client";

import { ErrorWidget, FigureInfoStage } from "@/features/shared";
import PersonalForm from "./personal-details";
import OtherDetailsForm from "./other-details";
import { useAddFigureCTX } from "./context";
import { validateBasicInfo } from "../validate-forms";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BasicInfoStage = ({ stage }: { stage: FigureInfoStage }) => {
  const { basicInfo, saveToLocal } = useAddFigureCTX();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const errors = validateBasicInfo(basicInfo);

    if (Object.keys(errors).length > 0) {
      const err =
        errors[Object.keys(errors)[0] as keyof typeof errors] ??
        "Please fill in all required fields";
      setError(err);
      toast.error(err);
      return;
    }

    saveToLocal();
    router.replace("/guonopedia/figures/add");
  };

  return (
    <>
      {stage === "basicInfo" && (
        <div className="dark-box max-md:px-0 w-full">
          <div className="flex items-center justify-between gap-4 max-md:px-3">
            <h2 className="text-white font-medium text-lg">1. Basic Info</h2>

            <div className="flex items-center gap-4">
              <button className="primary-btn py-2" onClick={handleSubmit}>
                Done
              </button>
            </div>
          </div>

          <ErrorWidget message={error} action={() => setError("")} />

          <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-6 mt-8">
            <PersonalForm />
            <OtherDetailsForm />
          </div>
        </div>
      )}
    </>
  );
};

export default BasicInfoStage;
