"use client";

import { addReview } from "@/features/dictionary/lib/api";
import { BaseTextArea, Stars } from "@/features/shared";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import { Loader2 } from "lucide-react";
import { useSingleWordContext } from "../context";

const AddReviewForm = () => {
  const { setReviewView } = useSingleWordContext();
  const [formData, setFormData] = useState({
    rating: 0,
    review: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const params = useParams();
  const id = (params.id as string) ?? "";
  const token = getAccessToken();

  const handleClose = () => {
    setFormData({
      rating: 0,
      review: "",
    });
    setReviewView("view");
  };

  const handleSubmit = async () => {
    setLoading(true);
    await addReview({
      id,
      token,
      payload: formData,
    })
      .then((v) => {
        if (v) {
          handleClose();
          router.refresh();
        }
      })
      .finally(() => {
        setLoading(false);
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
