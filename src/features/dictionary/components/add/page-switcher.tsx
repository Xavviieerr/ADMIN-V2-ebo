"use client";
import { GoBackButton } from "@/features/shared";
import { useRouter } from "next/navigation";
import React from "react";
import { SensesWrapper, WordDetailsForm } from ".";
import Preview from "./preview";
import { useWordContext } from "./context";

const PageSwitcher = ({
  dialects,
}: {
  dialects: { name: string; id: string }[];
}) => {
  const { page, setPage } = useWordContext();

  const router = useRouter();

  const handleBack = () => {
    if (page === "preview") return setPage("senses");
    if (page === "senses") return setPage("details");
    return router.push("/guonopedia/dictionary");
  };
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 text-white font-plus-sans">
      <GoBackButton onClick={handleBack} />

      {page === "details" ? (
        <WordDetailsForm dialects={dialects} />
      ) : page === "senses" ? (
        <SensesWrapper />
      ) : (
        <Preview />
      )}
    </div>
  );
};

export default PageSwitcher;
