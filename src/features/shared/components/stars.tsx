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

  return (
    <div className="flex items-center gap-1">
      {Array(rating)
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

      {Array(5 - rating)
        .fill("")
        .map((_, i) => (
          <Star
            onClick={() => handleClick(rating + i + 1)}
            key={i}
            strokeWidth={1.2}
            size={size}
          />
        ))}
    </div>
  );
};

export default Stars;
