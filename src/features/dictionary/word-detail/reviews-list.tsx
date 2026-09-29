"use client";

import React from "react";
import { SingleWord } from "../lib";
import ReviewCard from "./review-card";
import { OpenAddReviewButton } from "./buttons";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const ReviewsList = ({ ratings }: { ratings: SingleWord["wordRatings"] }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  return (
    <div className="flex flex-col gap-4 my-10 w-full md:max-w-4xl">
      {/* <p className="text-xl ">Reviews ({ratings.length})</p> */}

      {ratings
        .filter((item) => item.parentId == null)
        .map((rating) => (
          <ReviewCard
            key={rating.id}
            rating={rating}
            replies={ratings.filter((item) => item.parentId === rating.id)}
          />
        ))}

      {ratings.length == 0 && (
        <div className="flex flex-col items-center justify-center input py-7 gap-4">
          <p>{t("common.dictionary.noReviews", "No reviews for this word yet")}</p>
          <OpenAddReviewButton />
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
