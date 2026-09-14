"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown, Keyboard, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BaseInput } from "@/features/shared";
import { useKeyboard } from "@/features/shared/components/keyboard-context";
import { useDebounce } from "@/hooks/use-debounce";

const filters = [
  { label: "All", value: "all" },
  { label: "Has Audio", value: "hasAudio" },
  { label: "No Audio", value: "noAudio" },
  { label: "Has Image", value: "hasImage" },
  { label: "No Image", value: "noImage" },
];

const WordsFilter = ({ filter }: { filter: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setShowKeyboard } = useKeyboard();

  const searchTerm = searchParams.get("search") ?? "";

  const [query, setQuery] = useState(searchTerm);

  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [type, setType] = useState(filter);

  const [showOptions, setShowOptions] = useState(false);
  // const [showKeyboard, setShowKeyboard] = useState(false);
  const debouncedValue = useDebounce(query, 300);

  useEffect(() => {
    handleSearch(debouncedValue);
  }, [debouncedValue]);

  const handleSearch = (v: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    if (v) {
      currentParams.set("search", v);
    } else {
      currentParams.delete("search");
    }

    const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
    router.replace(newPath);
  };

  const handleFilter = (filterValue: string) => {
    setType(filterValue);
    setShowOptions(false);

    const currentParams = new URLSearchParams(searchParams.toString());

    if (filterValue) {
      currentParams.set("type", filterValue);
    } else {
      currentParams.delete("filter");
    }

    const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
    router.replace(newPath);
  };

  return (
    <div className="flex max-sm:flex-col gap-4 md:w-fit w-full shrink-0">
      <div className="relative flex-1 md:max-w-100 w-full z-10 ">
        <BaseInput
          type="text"
          placeholder={t("common.searchWords")}
          value={query}
          setValue={(e) => setQuery(e as string)}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-txt-50">
          <Search strokeWidth={1.3} />
          {/* <button
            type="button"
            onClick={() => setShowKeyboard((prev) => !prev)}
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Toggle keyboard"
            title="Virtual Keyboard"
          >
            <Keyboard className="h-4 w-4 sm:h-5 sm:w-5" />
          </button> */}

          {/* {searchTerm && (
            <button
              type="button"
              onClick={() => {
                handleSearch("");
              }}
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )} */}
        </div>
      </div>

      <div className="flex items-center gap-5 text-sm">
        <div
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center justify-between gap-4 min-w-30 relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
        >
          <p>{filters.find((item) => item.value === type)?.label}</p>
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />

          {showOptions && (
            <div className="absolute top-full left-0 mt-2 w-full transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg">
              {filters.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleFilter(item.value)}
                  className="w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId="users-search-input"
          onInput={(text) => {
            const targetInput = document.getElementById(
              "users-search-input",
            ) as HTMLInputElement;
            if (targetInput) {
              handleSearch(targetInput.value);
            }
          }}
          onClose={() => setShowKeyboard(false)}
        />
      )} */}
    </div>
  );
};

export default WordsFilter;
