"use client";

import { useAddWordReviewMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { BaseTextArea, Stars } from "@/features/shared";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSingleWordReviewContext } from "../contexts/SingleWordReviewContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const AddReviewForm = () => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { setReviewView } = useSingleWordReviewContext();
  const [formData, setFormData] = useState({
    rating: 0,
    review: "",
  });
  const [addReview, { isLoading: loading }] = useAddWordReviewMutation();
  const router = useRouter();

  const params = useParams();
  const id = (params.id as string) ?? "";

  const handleClose = () => {
    setFormData({
      rating: 0,
      review: "",
    });
    setReviewView("view");
  };

  const handleSubmit = async () => {
    await runDictionaryMutation({
      run: () =>
        addReview({
          id,
          rating: formData.rating,
          review: formData.review,
        }).unwrap(),
      successMessage: t("common.dictionary.reviewAdded", "Word review added successfully!"),
      errorMessage: t("common.dictionary.failedToAddReview", "Failed to add review"),
      onSuccess: () => {
        handleClose();
        router.refresh();
      },
    });
    return;
  };

  return (
    <div className="flex flex-col w-full md:max-w-4xl gap-4">
      <Stars
        rating={formData.rating}
        size={32}
        onClick={(val) => setFormData({ ...formData, rating: val })}
      />

      <BaseTextArea
        placeholder={t("common.dictionary.reviewPlaceholder", "Add a review to this word...")}
        value={formData.review}
        setValue={(val) => setFormData({ ...formData, review: val })}
        rows={6}
        styling="p-3 text-sm"
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          className="secondary-btn"
          disabled={loading}
          onClick={handleClose}
        >
          {t("common.cancel", "Cancel")}
        </button>
        <button
          onClick={handleSubmit}
          className="primary-btn"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : t("common.submit", "Submit")}
        </button>
      </div>
    </div>
  );
};

export default AddReviewForm;
