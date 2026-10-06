"use client";

import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import type { FilterOption } from "../model/constants";

function selectedLabel(options: FilterOption[], value: string, fallback: string): string {
  return options.find((item) => item.value === value)?.label ?? fallback;
}

// Generic accessible dropdown (users search-filter pattern): keyboard-operable
// trigger, Escape/outside-click close, listbox semantics.
function FilterDropdown({
  id,
  prefix,
  value,
  options,
  onChange,
}: {
  id: string;
  prefix: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  useEffect(() => {
    if (!showOptions) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  return (
    <div
      ref={containerRef}
      id={id}
      role="button"
      tabIndex={0}
      aria-haspopup="listbox"
      aria-expanded={showOptions}
      aria-label={`${prefix} filter`}
      onClick={() => setShowOptions(!showOptions)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setShowOptions(!showOptions);
        } else if (e.key === "Escape") {
          setShowOptions(false);
        }
      }}
      className="flex items-center justify-between gap-4 min-w-30 max-md:w-full relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
    >
      <p>
        <span className="text-gray-400 mr-2">{prefix}:</span>
        {selectedLabel(options, value, t("common.all", "All"))}
      </p>
      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />

      {showOptions && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute top-full left-0 mt-2 w-full transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg z-20"
        >
          {options.map((item) => (
            <button
              key={item.value || "all"}
              role="option"
              aria-selected={item.value === value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(item.value);
                setShowOptions(false);
              }}
              className="w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
