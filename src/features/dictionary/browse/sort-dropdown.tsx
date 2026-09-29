"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const sortOptions = [
  { key: "common.dictionary.sortAlphaAsc", fallback: "Alphabetically (A–Z)", sortBy: "ota", sortDir: "ASC" },
  // { key: "common.dictionary.sortAlphaDesc", fallback: "Alphabetically (Z–A)", sortBy: "ota", sortDir: "DESC" },
  // { key: "common.dictionary.sortUpdated", fallback: "Recently updated", sortBy: "updatedAt", sortDir: "DESC" },
  // { key: "common.dictionary.sortAdded", fallback: "Recently added", sortBy: "createdAt", sortDir: "DESC" },
  // { key: "common.dictionary.sortOldest", fallback: "Oldest first", sortBy: "createdAt", sortDir: "ASC" },
];

const SortDropdown = () => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSortBy = searchParams.get("sortBy") ?? "ota";
  const activeSortDir = searchParams.get("sortDir") ?? "ASC";

  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSort = (sortBy: string, sortDir: string) => {
    setShowOptions(false);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");
    currentParams.set("sortBy", sortBy);
    currentParams.set("sortDir", sortDir);

    const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
    router.replace(newPath);
  };

  const isActive = (sortBy: string, sortDir: string) =>
    activeSortBy === sortBy && activeSortDir === sortDir;

  return (
    <div className="flex items-center gap-5 text-sm flex-1 min-w-0">
      <div
        ref={dropdownRef}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={showOptions}
        aria-label={t("common.dictionary.sortWords", "Sort words")}
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
        <p>{t("common.dictionary.sort", "Sort")}</p>
        <ChevronDown
          className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${showOptions ? "rotate-180" : ""}`}
        />

        {showOptions && (
          <div
            role="listbox"
            aria-label={t("common.dictionary.sortOptions", "Sort options")}
            className="absolute top-full left-0 max-sm:left-auto max-sm:right-0 mt-2 w-full min-w-52 max-h-72 overflow-y-auto custom-scrollbar z-20 transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg"
          >
            {sortOptions.map((item) => (
              <button
                key={`${item.sortBy}-${item.sortDir}`}
                role="option"
                aria-selected={isActive(item.sortBy, item.sortDir)}
                onClick={() => handleSort(item.sortBy, item.sortDir)}
                className={`w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer ${isActive(item.sortBy, item.sortDir) ? "text-foreground-50 font-medium" : ""}`}
              >
                {t(item.key, item.fallback)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortDropdown;
