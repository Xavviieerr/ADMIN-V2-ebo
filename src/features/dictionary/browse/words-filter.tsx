"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BaseInput } from "@/features/shared";

import { useDebounce } from "@/hooks/use-debounce";

const filters = [
  { key: "common.dictionary.all", fallback: "All", value: "all" },
  { key: "common.dictionary.hasAudio", fallback: "Has Audio", value: "hasAudio" },
  { key: "common.dictionary.noAudio", fallback: "No Audio", value: "noAudio" },
  { key: "common.dictionary.hasImage", fallback: "Has Image", value: "hasImage" },
  { key: "common.dictionary.noImage", fallback: "No Image", value: "noImage" },
];

const WordsFilter = ({ filter }: { filter: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") ?? "";

  const [query, setQuery] = useState(searchTerm);

  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [type, setType] = useState(filter);

  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const [showKeyboard, setShowKeyboard] = useState(false);
  const debouncedValue = useDebounce(query, 300);
  const firstRun = useRef(true);

  useEffect(() => {
    if (!showOptions) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showOptions]);

  const handleSearch = useCallback((v: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");

    if (v) {
      currentParams.set("search", v);
    } else {
      currentParams.delete("search");
    }

    const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
    router.replace(newPath);
  }, [searchParams, router]);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (debouncedValue !== searchTerm) {
      handleSearch(debouncedValue);
    }
  }, [debouncedValue, handleSearch, searchTerm]);

  const handleFilter = (filterValue: string) => {
    setType(filterValue);
    setShowOptions(false);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");

    if (filterValue) {
      currentParams.set("type", filterValue);
    } else {
      currentParams.delete("type");
    }

    const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
    router.replace(newPath);
  };

  return (
    <div className="contents">
      <div className="relative w-full md:w-96 md:flex-none basis-full md:basis-auto z-10 ">
        <BaseInput
          type="text"
          placeholder={t("common.searchWords", "Search words...")}
          value={query}
          setValue={(e) => setQuery(e as string)}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-txt-50">
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label={t("common.dictionary.clearSearch", "Clear search")}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
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

      <div className="flex items-center gap-5 text-sm flex-1 min-w-0">
        <div
          ref={dropdownRef}
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={showOptions}
          aria-label={t("common.dictionary.filterWords", "Filter words")}
          onClick={() => setShowOptions(!showOptions)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowOptions(!showOptions);
            }
            if (e.key === "Escape") {
              setShowOptions(false);
            }
          }}
          className="flex items-center justify-between gap-2 md:gap-4 min-w-0 md:min-w-30 relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-3 md:px-5 py-3 rounded-lg outline-none cursor-pointer"
        >
          <p>{t("common.dictionary.filter", "Filter")}</p>
          <ChevronDown
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${showOptions ? "rotate-180" : ""}`}
          />

          {showOptions && (
            <div
              role="listbox"
              aria-label={t("common.dictionary.filterOptions", "Filter options")}
              className="absolute top-full left-0 mt-2 w-full min-w-52 max-h-72 overflow-y-auto custom-scrollbar z-20 transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg"
            >
              {filters.map((item) => (
                <button
                  key={item.value}
                  role="option"
                  aria-selected={type === item.value}
                  onClick={() => handleFilter(item.value)}
                  className={`w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer ${type === item.value ? "text-foreground-50 font-medium" : ""}`}
                >
                  {t(item.key, item.fallback)}
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
