"use client";
import { PenBox } from "lucide-react";
import React, { useState } from "react";
import { EditWordDetails } from "../forms";
import { SingleWord } from "@/features/dictionary/lib";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const EditWord = ({
  data,
  dialects,
}: {
  data: SingleWord;
  dialects: { id: string; name: string }[];
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        title={t("common.dictionary.editWordDetail", "Edit word detail")}
        aria-label={t("common.dictionary.editWordDetail", "Edit word detail")}
        onClick={() => setOpen(true)}
        className="text-foreground-50 cursor-pointer flex items-center gap-1 text-sm"
      >
        <PenBox size={16} />
        <span className="text-xs font-medium">{t("common.dictionary.editWordDetail", "Edit word detail")}</span>
      </button>

      {open && (
        <EditWordDetails
          dialects={dialects}
          word={data}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default EditWord;
