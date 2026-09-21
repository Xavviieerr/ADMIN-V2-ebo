import React from "react";
import { SingleWord } from "../../lib";
import ReviewCard from "./review-card";
import { AddReviewButton } from "./buttons";

const ReviewsList = ({ ratings }: { ratings: SingleWord["wordRatings"] }) => {
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
          <p>No reviews for this word yet</p>
          <AddReviewButton />
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
