"use client";
import { ReviewForm } from "../forms";
import { useSingleWordView } from "@/features/dictionary/word-detail/hooks/useSingleWordView";
import { useSingleWordReviewContext } from "../contexts/SingleWordReviewContext";

const ReviewListWrapper = ({ children }: { children: React.ReactNode }) => {
  const { tab } = useSingleWordView();
  const { reviewView } = useSingleWordReviewContext();

  if (tab !== "reviews") return null;

  if (reviewView === "add") return <ReviewForm />;
  return <>{children}</>;
};

export default ReviewListWrapper;
