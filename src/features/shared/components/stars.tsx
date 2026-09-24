"use client";
import { Star } from "lucide-react";
import React from "react";

const Stars = ({
  rating,
  size = 14,
  onClick,
}: {
  rating: number;
  size?: number;
  onClick?: (rating: number) => void;
}) => {
  const handleClick = (value: number) => {
    if (onClick !== undefined) {
      onClick(value);
    }
  };

  const safeRating = Number.isFinite(rating)
    ? Math.max(0, Math.min(5, Math.floor(rating)))
    : 0;

  return (
    <div className="flex items-center gap-1">
      {Array(safeRating)
        .fill("")
        .map((_, i) => (
          <Star
            onClick={() => handleClick(i + 1)}
            key={i}
            fill="#F6EF8F"
            strokeWidth={1.2}
            size={size}
          />
        ))}

      {Array(5 - safeRating)
        .fill("")
        .map((_, i) => (
          <Star
            onClick={() => handleClick(safeRating + i + 1)}
            key={i}
            strokeWidth={1.2}
            size={size}
          />
        ))}
    </div>
  );
};

export default Stars;
