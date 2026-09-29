"use client";

import React from "react";
import { useSingleWordSenseContext } from "../contexts/SingleWordSenseContext";
import { SingleWord } from "@/features/dictionary/lib";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const EditSense = ({
  sense,
  index,
}: {
  sense: SingleWord["oho"][number];
  index: number;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { setSelectedSense } = useSingleWordSenseContext();
  return (
    <button
      title={t("common.dictionary.editSense", "Edit Sense")}
      onClick={() => {
        setSelectedSense({ ...sense, index });
      }}
      className="secondary-btn py-2 text-sm cursor-pointer rounded-md"
    >
      {t("common.dictionary.editSense", "Edit Sense")}
    </button>
  );
};

export default EditSense;
