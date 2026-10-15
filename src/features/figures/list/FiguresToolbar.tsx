"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import VirtualUrhoboKeyboard from "@/components/virtualUrhoboKeyboard";
import { useLocale } from "@/contexts/LocaleContext";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslation } from "@/hooks/useTranslation";
import { Keyboard, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";
import FilterDropdown from "./FilterDropdown";
import {
  FIGURE_OCCUPATION_OPTIONS,
  FIGURE_SORT_DIR_OPTIONS,
  FIGURE_SORT_FIELD_OPTIONS,
  FIGURE_STATUS_OPTIONS,
  type FilterOption,
} from "../model/filter-options";
import type { FiguresToolbarFilters } from "../model/types";

function readFilters(searchParams: URLSearchParams): FiguresToolbarFilters {
  return {
    search: searchParams.get("search") ?? "",
    occupation: searchParams.get("occupation") ?? searchParams.get("category") ?? "",
    status: searchParams.get("status") ?? "",
    sortBy: searchParams.get("sortBy") ?? "fullName",
    sortDir: searchParams.get("sortDir") ?? "ASC",
  };
}

const FiguresToolbar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const tx = (options: FilterOption[]) =>
    options.map((item) => ({
      ...item,
      label: item.labelKey ? t(item.labelKey, item.label) : item.label,
    }));

  const initial = readFilters(searchParams);
  const [searchTerm, setSearchTerm] = useState(initial.search);
  const [occupation, setOccupation] = useState(initial.occupation);
  const [status, setStatus] = useState(initial.status);
  const [sortBy, setSortBy] = useState(initial.sortBy);
  const [sortDir, setSortDir] = useState(initial.sortDir);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debouncedValue = useDebounce(searchTerm.trim(), 500);

  const appliedKey = useRef<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const key = params.toString();
    if (appliedKey.current === key) return;
    appliedKey.current = key;
    const next = readFilters(params);
    setSearchTerm(next.search);
    setOccupation(next.occupation);
    setStatus(next.status);
    setSortBy(next.sortBy);
    setSortDir(next.sortDir);
  }, [searchParams]);

  const writeUrl = (next: FiguresToolbarFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.search) params.set("search", next.search);
    else params.delete("search");
    if (next.occupation) params.set("occupation", next.occupation);
    else {
      params.delete("occupation");
      params.delete("category");
    }
    if (next.status) params.set("status", next.status);
    else params.delete("status");
    if (next.sortBy && next.sortBy !== "fullName") params.set("sortBy", next.sortBy);
    else params.delete("sortBy");
    if (next.sortDir && next.sortDir !== "ASC") params.set("sortDir", next.sortDir);
    else params.delete("sortDir");
    params.set("page", "1");
    appliedKey.current = params.toString();
    startTransition(() => {
      router.replace(`/guonopedia/figures?${params.toString()}`, { scroll: false });
    });
  };

  const lastPushedSearch = useRef(debouncedValue);
  useEffect(() => {
    if (debouncedValue === lastPushedSearch.current) return;
    lastPushedSearch.current = debouncedValue;
    writeUrl({ search: debouncedValue, occupation, status, sortBy, sortDir });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleDropdownChange = (patch: Partial<FiguresToolbarFilters>) => {
    const next = { search: debouncedValue, occupation, status, sortBy, sortDir, ...patch };
    if (patch.occupation !== undefined) setOccupation(patch.occupation);
    if (patch.status !== undefined) setStatus(patch.status);
    if (patch.sortBy !== undefined) setSortBy(patch.sortBy);
    if (patch.sortDir !== undefined) setSortDir(patch.sortDir);
    writeUrl(next);
  };

  return (
    <div className="flex max-md:flex-col max-md:gap-5 gap-3 w-full justify-between mt-10 mb-5">
      <div className="relative flex-1 max-w-100 w-full z-10">
        <label htmlFor="figures-search-input" className="sr-only">
          {t("common.searchFigures", "Search figures")}
        </label>
        <input
          id="figures-search-input"
          type="search"
          placeholder={t("common.searchFigures", "Search figures")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="input pl-10 pr-16"
        />

        <svg
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label={t("common.toggleKeyboard", "Toggle keyboard")}
            aria-expanded={showKeyboard}
            title={t("common.virtualKeyboard", "Virtual Keyboard")}
          >
            <Keyboard className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {searchTerm && !isPending && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
              }}
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label={t("common.clearSearch", "Clear search")}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
          {isPending && (
            <div role="status" aria-label={t("common.searching", "Searching")}>
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap max-md:flex-col-reverse max-md:items-stretch items-center gap-4">
        <FilterDropdown
          id="figures-occupation-filter"
          prefix={t("figures.occupationLabel", "Occupation")}
          value={occupation}
          options={tx(FIGURE_OCCUPATION_OPTIONS)}
          onChange={(value) => handleDropdownChange({ occupation: value })}
        />
        <FilterDropdown
          id="figures-status-filter"
          prefix={t("common.status", "Status")}
          value={status}
          options={tx(FIGURE_STATUS_OPTIONS)}
          onChange={(value) => handleDropdownChange({ status: value })}
        />
        <FilterDropdown
          id="figures-sort-field"
          prefix={t("figures.sortByLabel", "Sort by")}
          value={sortBy}
          options={tx(FIGURE_SORT_FIELD_OPTIONS)}
          onChange={(value) => handleDropdownChange({ sortBy: value })}
        />
        <FilterDropdown
          id="figures-sort-dir"
          prefix={t("figures.sortByLabel", "Sort by")}
          value={sortDir}
          options={tx(FIGURE_SORT_DIR_OPTIONS)}
          onChange={(value) => handleDropdownChange({ sortDir: value })}
        />
      </div>

      {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId="figures-search-input"
          onInput={() => {
            const targetInput = document.getElementById(
              "figures-search-input",
            ) as HTMLInputElement | null;
            if (targetInput) {
              setSearchTerm(targetInput.value);
            }
          }}
          onClose={() => setShowKeyboard(false)}
        />
      )}
    </div>
  );
};

export default FiguresToolbar;
