"use client";

import { SingleWord } from "@/features/dictionary/lib";
import { useRouter } from "next/navigation";
import React from "react";
import { useSetWordToReviewMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/hooks/runDictionaryMutation";
import { Loader2 } from "lucide-react";

const SetInReviewButton = ({ data }: { data: SingleWord }) => {
  const [reviewWord, { isLoading: loading }] = useSetWordToReviewMutation();
  const router = useRouter();

  const handleSubmit = () => {
    runDictionaryMutation({
      run: () => reviewWord({ id: data.id }).unwrap(),
      successMessage: "Word set in review successfully!",
      errorMessage: "Failed to set word in review",
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
      {loading ? <Loader2 className="animate-spin" /> : "Set in Review"}
    </button>
  );
};

export default SetInReviewButton;
