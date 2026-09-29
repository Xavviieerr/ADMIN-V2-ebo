"use client";
import React from "react";
import { useSingleWordReviewContext } from "../contexts/SingleWordReviewContext";
import { PenBox } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const OpenAddReviewButton = () => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { setReviewView } = useSingleWordReviewContext();
  return (
    <button
      onClick={() => setReviewView("add")}
      className="primary-btn px-10 flex items-center gap-3 py-2"
    >
      <PenBox width={16} /> {t("common.add", "Add")}
    </button>
  );
};

export default OpenAddReviewButton;
