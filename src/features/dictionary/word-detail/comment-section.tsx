"use client";
import React, { useState } from "react";
import { useReplyToReviewMutation } from "@/slice/requestSlice";
import { runDictionaryMutation } from "@/features/dictionary/lib/run-dictionary-mutation";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BaseTextArea } from "@/features/shared";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const CommentSection = ({ parentId }: { parentId: string }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState("");
  const [replyReview, { isLoading: loading }] = useReplyToReviewMutation();
  const router = useRouter();

  const params = useParams();
  const id = (params.id as string) ?? "";

  const handleClose = () => {
    setReview("");
    setOpen(false);
  };

  const handleSubmit = () => {
    runDictionaryMutation({
      run: () =>
        replyReview({
          wordId: id,
          parentId,
          review,
        }).unwrap(),
      successMessage: t("common.dictionary.reviewAdded", "Word review added successfully!"),
      errorMessage: t("common.dictionary.failedToAddReply", "Failed to add reply"),
      onSuccess: () => {
        handleClose();
        router.refresh();
      },
    });
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="secondary-btn px-10 mt-4 w-fit py-2"
      >
        {t("common.dictionary.reply", "Reply")}
      </button>
    );

  return (
    <>
      <hr className="h-px border-t border-gray-txt-50/20 w-full my-4" />

      <BaseTextArea
        placeholder={t("common.dictionary.replyPlaceholder", "Reply to this review comment...")}
        value={review}
        setValue={(val) => setReview(val)}
        rows={4}
        styling="p-3 text-sm resize-none"
      />

      <div className="flex justify-end gap-3 mt-4">
        <button className="secondary-btn" onClick={handleClose}>
          {t("common.cancel", "Cancel")}
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="primary-btn"
        >
          {loading ? <Loader2 className="animate-spin" /> : t("common.dictionary.reply", "Reply")}
        </button>
      </div>
    </>
  );
};

export default CommentSection;
