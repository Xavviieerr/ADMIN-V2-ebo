"use client";

import VirtualUrhoboKeyboard from "@/components/virtualUrhoboKeyboard";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import React, { useState } from "react";
import { categories } from "../lib/category-list";

const _filters = [
  { label: "All", value: "" },
  { label: "Historic Rulers", value: "historic ruler" },
  { label: "Musicians", value: "musician" },
  { label: "Politicians", value: "politician" },
  { label: "Scientists", value: "scientist" },
  { label: "Traditional Rulers", value: "traditional ruler" },
  { label: "Warriors", value: "warrior" },
];

const FiguresFilter = ({ filter }: { filter: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") ?? "";

  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [category, setCategory] = useState(filter);

  const [showOptions, setShowOptions] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleSearch = useDebouncedCallback((v: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (v) {
      currentParams.set("search", v);
    } else {
      currentParams.delete("search");
    }

    const newPath = `/guonopedia/figures?${currentParams.toString()}`;
    router.replace(newPath);
  }, 300);

  const handleFilter = (filterValue: string) => {
    setCategory(filterValue);
    setShowOptions(false);

    const currentParams = new URLSearchParams(searchParams.toString());

    if (filterValue) {
      currentParams.set("category", filterValue);
    } else {
      currentParams.delete("category");
    }

    const newPath = `/guonopedia/figures?${currentParams.toString()}`;
    router.replace(newPath);
  };

  return (
    <div className="flex max-sm:flex-col gap-4 mt-8 md:w-fit w-full shrink-0">
      <div className="relative flex-1 md:max-w-100 w-full z-10">
        <input
          id="users-search-input"
          type="text"
          placeholder={t("common.searchFigures")}
          defaultValue={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="input px-5"
        />
      </div>

      <div className="flex items-center gap-5 text-sm">
        <div
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center justify-between gap-4 min-w-30 relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
        >
          <p>{category}</p>
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />

          {showOptions && (
            <div className="absolute top-full w-40 left-0 mt-2 max-h-40 overflow-y-scroll transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => handleFilter(item)}
                  className="w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId="users-search-input"
          onInput={(_text) => {
            const targetInput = document.getElementById(
              "users-search-input",
            ) as HTMLInputElement;
            if (targetInput) {
              handleSearch(targetInput.value);
            }
          }}
          onClose={() => setShowKeyboard(false)}
        />
      )}
    </div>
  );
};

export default FiguresFilter;
