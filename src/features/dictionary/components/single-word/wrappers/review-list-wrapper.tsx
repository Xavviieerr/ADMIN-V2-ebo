"use client";
import { AddReviewForm } from "../forms";
import { useSingleWordContext } from "../context";

const ReviewListWrapper = ({ children }: { children: React.ReactNode }) => {
  const { reviewView, tab } = useSingleWordContext();

  if (tab !== "reviews") return null;

  if (reviewView === "add") return <AddReviewForm />;
  return <>{children}</>;
};

export default ReviewListWrapper;
