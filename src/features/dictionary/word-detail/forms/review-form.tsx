"use client";

import { useAddWordReviewMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/hooks/runDictionaryMutation";
import { BaseTextArea, Stars } from "@/features/shared";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSingleWordReviewContext } from "../contexts/SingleWordReviewContext";

const AddReviewForm = () => {
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
      successMessage: "Word review added successfully!",
      errorMessage: "Failed to add review",
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
        placeholder="Add a review to this word..."
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
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="primary-btn"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddReviewForm;
