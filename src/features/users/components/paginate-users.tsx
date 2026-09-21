"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const UsersPagination = ({
  currentPage,
  totalPages,
  showText = true,
  handlePrev,
  handleNext,
  jumpToPage,
}: {
  currentPage: number;
  totalPages: number;
  showText?: boolean;
  handlePrev: () => void;
  handleNext: () => void;
  jumpToPage: (page: number) => void;
}) => {
  const range = (end: number) => Array.from({ length: end }, (_, i) => 1 + i);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    jumpToPage(Number(e.target.value));
  };

  return (
    <div className="flex max-md:flex-col-reverse gap-4 w-full max-md:text-sm justify-between md:items-center items-end self-center mt-10 font-header pb-20">
      {totalPages > 1 && (
        <div className="flex items-center gap-4">
          <label htmlFor="page">Jump to page: </label>
          <select
            onChange={handleChange}
            value={currentPage}
            id="page"
            className="input h-10 text-sm w-20"
          >
            {range(totalPages).map((num) => (
              <option
                key={num}
                value={num}
                className="text-white bg-secondary-bg"
              >
                {num}
              </option>
            ))}
          </select>
        </div>
      )}

      {showText && (
        <p className="max-md:hidden">
          Showing Page {currentPage} of {totalPages}
        </p>
      )}

      <div className="flex items-center gap-4 font-bold text-plain-gray-800">
        {currentPage != 1 ? (
          <button onClick={handlePrev}>
            <ChevronLeft />
          </button>
        ) : (
          <ChevronLeft className="text-gray-txt-50/50 cursor-default" />
        )}

        {range(totalPages)
          .filter((val, index) => index < 3)
          .map((num) => (
            <button
              key={num}
              onClick={() => jumpToPage(num)}
              className="cursor-pointer"
            >
              <div
                className={`${
                  num === currentPage ? "bg-foreground-50 text-base-bg" : ""
                }  w-8 h-8 rounded flex justify-center items-center`}
              >
                {num}
              </div>
            </button>
          ))}

        {totalPages > 4 && <p>...</p>}

        {totalPages > 3 && (
          <button
            onClick={() => jumpToPage(totalPages)}
            className="cursor-pointer"
          >
            <div
              className={`${
                totalPages === currentPage
                  ? "bg-foreground-50 text-base-bg"
                  : ""
              }  w-8 h-8 rounded flex justify-center items-center`}
            >
              {totalPages}
            </div>
          </button>
        )}

        {currentPage != totalPages ? (
          <button onClick={handleNext}>
            <ChevronRight />
          </button>
        ) : (
          <ChevronRight className="text-gray-text-50/50 cursor-default" />
        )}
      </div>
    </div>
  );
};

export default UsersPagination;
