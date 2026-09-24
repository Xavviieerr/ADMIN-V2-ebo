import React from "react";
import { SingleWord } from "../lib";
import { KeyValueParagraph, Stars } from "@/features/shared";

const RatingsSection = ({ data }: { data: SingleWord }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-4 pt-5 pb-5 border-b border-gray-txt-50/20">
      <div className="flex items-center gap-3 max-md:col-span-2">
        <span>Average Rating:</span>

        <Stars rating={data.averageRating ?? 0} />
      </div>
      <KeyValueParagraph item="Total Ratings" value={data.totalRatings} />
      <KeyValueParagraph item="Total Reviews" value={data.totalReviews} />
    </div>
  );
};

export default RatingsSection;
