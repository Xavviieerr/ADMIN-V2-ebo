"use client";

import { SingleWord } from "@/features/dictionary/lib";
import { useRouter } from "next/navigation";
import React from "react";
import { useSetWordToReviewMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const SetInReviewButton = ({ data }: { data: SingleWord }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [reviewWord, { isLoading: loading }] = useSetWordToReviewMutation();
  const router = useRouter();

  const handleSubmit = () => {
    runDictionaryMutation({
      run: () => reviewWord({ id: data.id }).unwrap(),
      successMessage: t("common.dictionary.wordInReview", "Word set in review successfully!"),
      errorMessage: t("common.dictionary.failedToSetInReview", "Failed to set word in review"),
      onSuccess: () => {
        router.refresh();
      },
    });
  };
  if (data.status.toLowerCase() !== "pending") return null;

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="primary-btn text-sm"
    >
      {loading ? <Loader2 className="animate-spin" /> : t("common.dictionary.setInReview", "Set in Review")}
    </button>
  );
};

export default SetInReviewButton;
