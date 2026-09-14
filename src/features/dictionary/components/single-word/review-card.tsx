import React from "react";
import { SingleWord } from "@/features/dictionary/lib";
import { User2, User } from "lucide-react";
import moment from "moment";
import CommentSection from "./comment-section";
import { Stars } from "@/features/shared";

const ReviewCard = ({
  rating,
  replies,
}: {
  rating: SingleWord["wordRatings"][number];
  replies: SingleWord["wordRatings"] | undefined;
}) => {
  return (
    <div key={rating.id} className="input flex flex-col gap-3 py-5 font-normal">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-foreground-50 text-base-bg flex items-center justify-center">
            <User2 size={20} strokeWidth={1.3} />
          </div>

          <div className="flex flex-col text-white gap-1">
            <p className="font-medium text-sm capitalize">
              {rating.user.username}
            </p>
            <p className="text-gray-txt-50 text-xs">
              {moment(rating.updatedAt).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <Stars rating={rating.rating} />
      </div>

      {rating.review && (
        <p className="text-sm text-gray-txt-50 whitespace-pre-wrap mt-2">
          {rating.review}
        </p>
      )}

      {replies && replies.length > 0 && (
        <div className="flex flex-col gap-2 w-full px-5 text-sm">
          Replies ({replies?.length}):
          {replies?.map((reply) => (
            <div
              key={reply.id}
              className="flex flex-col gap-1 items-start px-5 py-2 bg-gray-txt-50/10 w-full text-sm border-l-2 border-foreground-50 rounded-md"
            >
              <div className="flex items-center gap-2 text-xs mb-2">
                <User size={14} />
                <span className="text-gray-txt-50/90">
                  {reply.user.username +
                    " • " +
                    moment(reply.createdAt).format("DD/MM/yyyy")}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-white/80">
                {reply.review}
              </p>
            </div>
          ))}
        </div>
      )}

      {rating.review && <CommentSection parentId={rating.id} />}
    </div>
  );
};

export default ReviewCard;
