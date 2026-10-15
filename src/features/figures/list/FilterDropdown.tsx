"use client";

import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { FilterOption } from "../model/filter-options";

function selectedLabel(options: FilterOption[], value: string, fallback: string): string {
  return options.find((item) => item.value === value)?.label ?? fallback;
}

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
      className="flex items-center justify-between gap-4 min-w-30 relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
    >
      <p className="whitespace-nowrap">
        {prefix}: {selectedLabel(options, value, "All")}
      </p>
      <ChevronDown
        className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${showOptions ? "rotate-180" : ""}`}
      />

      {showOptions && (
        <div
          role="listbox"
          aria-label={`${prefix} options`}
          className="absolute top-full left-0 mt-2 w-full min-w-44 max-h-60 overflow-y-auto custom-scrollbar z-20 transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg"
        >
          {options.map((item) => {
            const isActive = item.value === value;
            return (
              <button
                key={item.value || "all"}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(item.value);
                  setShowOptions(false);
                }}
                className={`w-full text-left px-5 py-2.5 cursor-pointer ${
                  isActive ? "text-foreground-50 font-medium" : "hover:bg-gray-txt-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
