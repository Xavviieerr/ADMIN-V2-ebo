"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

export const PaginationWidget = ({
  currentPage,
  totalPages,
  showText = true,
}: {
  currentPage: number;
  totalPages: number;
  showText?: boolean;
}) => {
  const searchParams = useSearchParams();

  const range = (end: number) => Array.from({ length: end }, (_, i) => 1 + i);
  const router = useRouter();
  const [errMsg, setErrMsg] = useState("");
  const [value, setValue] = useState(String(currentPage));

  useEffect(() => {
    setValue(String(currentPage));
  }, [currentPage]);

  const debouncedPage = useDebounce(value, 1000);
  const inputRef = useRef<HTMLInputElement>(null);

  const buildLink = useCallback((page: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    return `?${currentParams.toString()}`;
  }, [searchParams]);

  useEffect(() => {
    if (!debouncedPage.trim() || debouncedPage === String(currentPage)) return;

    const debouncedNum = Number(debouncedPage);

    if (debouncedNum < 1 || debouncedNum > totalPages)
      return setErrMsg("Invalid page number");

    if (errMsg) setErrMsg("");
    router.replace(buildLink(debouncedNum));
    inputRef.current?.blur();
  }, [debouncedPage, router, buildLink, currentPage, errMsg, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex max-md:flex-wrap gap-4  w-full justify-between items-center self-center mt-6 font-header">
      <div className="flex flex-col gap-2 items-center">
        {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}
        <div className="flex items-center gap-4">
          <label htmlFor="page">Jump to: </label>
          <input
            value={value.toString()}
            ref={inputRef}
            min={1}
            max={totalPages}
            onChange={(e) => setValue(e.target.value)}
            id="page"
            className="input h-10 text-sm w-20"
          />
        </div>
      </div>

      {showText && (
        <p className="max-md:hidden shrink-0">
          Showing Page {currentPage} of {totalPages}
        </p>
      )}

      <div className="flex items-center gap-4 font-bold text-plain-gray-800">
        {currentPage != 1 ? (
          <Link href={buildLink(currentPage - 1)}>
            <ChevronLeft />
          </Link>
        ) : (
          <ChevronLeft className="text-gray-text-50 cursor-default" />
        )}

        {range(totalPages)
          .filter((val, index) => index < 3)
          .map((num) => (
            <Link key={num} href={buildLink(num)}>
              <div
                className={`${
                  num === currentPage ? "bg-foreground-50 text-base-bg" : ""
                }  w-8 h-8 rounded flex justify-center items-center`}
              >
                {num}
              </div>
            </Link>
          ))}

        {totalPages > 4 && <p>...</p>}

        {totalPages > 3 && (
          <Link href={buildLink(totalPages)}>
            <div
              className={`${
                totalPages === currentPage
                  ? "bg-foreground-50 text-base-bg"
                  : ""
              }  w-8 h-8 rounded flex justify-center items-center`}
            >
              {totalPages}
            </div>
          </Link>
        )}

        {currentPage != totalPages ? (
          <Link href={buildLink(currentPage + 1)}>
            <ChevronRight />
          </Link>
        ) : (
          <ChevronRight className="text-gray-txt-50 cursor-default" />
        )}
      </div>
    </div>
  );
};
