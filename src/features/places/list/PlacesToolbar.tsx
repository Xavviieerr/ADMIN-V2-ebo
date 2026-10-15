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
  PLACE_SORT_DIR_OPTIONS,
  PLACE_STATUS_OPTIONS,
  PLACE_TYPE_OPTIONS,
  type FilterOption,
} from "../model/filter-options";
import type { PlacesToolbarFilters } from "../model/types";

function readFilters(searchParams: URLSearchParams): PlacesToolbarFilters {
  return {
    search: searchParams.get("search") ?? "",
    type: searchParams.get("type") ?? "",
    status: searchParams.get("status") ?? "",
    sortDir: searchParams.get("sortDir") ?? "ASC",
  };
}

// Search + filter toolbar. Independent of list data so it stays mounted
// (and usable) even when the results request fails.
const PlacesToolbar: React.FC = () => {
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
  const [type, setType] = useState(initial.type);
  const [status, setStatus] = useState(initial.status);
  const [sortDir, setSortDir] = useState(initial.sortDir);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debouncedValue = useDebounce(searchTerm.trim(), 500);

  // Adopt URL state on browser back/forward. `appliedKey` tracks the query
  // this toolbar last wrote, so its own updates don't echo back.
  const appliedKey = useRef<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const key = params.toString();
    if (appliedKey.current === key) return;
    appliedKey.current = key;
    const next = readFilters(params);
    setSearchTerm(next.search);
    setType(next.type);
    setStatus(next.status);
    setSortDir(next.sortDir);
  }, [searchParams]);

  const writeUrl = (next: PlacesToolbarFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.search) params.set("search", next.search);
    else params.delete("search");
    if (next.type) params.set("type", next.type);
    else params.delete("type");
    if (next.status) params.set("status", next.status);
    else params.delete("status");
    // Order control sorts by creation date — pin sortBy so the labels
    // (Oldest/Newest first) always match backend behavior.
    params.set("sortBy", "createdAt");
    if (next.sortDir && next.sortDir !== "ASC") params.set("sortDir", next.sortDir);
    else params.delete("sortDir");
    // Search/filter changes restart at page 1 (avoids stale-page resets).
    params.set("page", "1");
    appliedKey.current = params.toString();
    startTransition(() => {
      router.replace(`/guonopedia/places?${params.toString()}`, { scroll: false });
    });
  };

  // Debounced search → URL (URLSearchParams encodes special chars).
  const lastPushedSearch = useRef(debouncedValue);
  useEffect(() => {
    if (debouncedValue === lastPushedSearch.current) return;
    lastPushedSearch.current = debouncedValue;
    writeUrl({ search: debouncedValue, type, status, sortDir });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleDropdownChange = (patch: Partial<PlacesToolbarFilters>) => {
    const next = { search: debouncedValue, type, status, sortDir, ...patch };
    if (patch.type !== undefined) setType(patch.type);
    if (patch.status !== undefined) setStatus(patch.status);
    if (patch.sortDir !== undefined) setSortDir(patch.sortDir);
    writeUrl(next);
  };

  return (
    <div className="flex max-md:flex-col max-md:gap-5 gap-3 w-full justify-between mt-10 mb-5">
      <div className="relative flex-1 max-w-100 w-full z-10">
        <label htmlFor="places-search-input" className="sr-only">
          {t("common.searchPlaces", "Search places")}
        </label>
        <input
          id="places-search-input"
          type="search"
          placeholder={t("common.searchPlaces", "Search places")}
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
          id="places-type-filter"
          prefix={t("places.typeLabel", "Type")}
          value={type}
          options={tx(PLACE_TYPE_OPTIONS)}
          onChange={(value) => handleDropdownChange({ type: value })}
        />
        <FilterDropdown
          id="places-status-filter"
          prefix={t("common.status", "Status")}
          value={status}
          options={tx(PLACE_STATUS_OPTIONS)}
          onChange={(value) => handleDropdownChange({ status: value })}
        />
        <FilterDropdown
          id="places-sort-dir"
          prefix={t("places.sortByCreatedAt", "Date created")}
          value={sortDir}
          options={tx(PLACE_SORT_DIR_OPTIONS)}
          onChange={(value) => handleDropdownChange({ sortDir: value })}
        />
      </div>

      {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId="places-search-input"
          onInput={() => {
            const targetInput = document.getElementById(
              "places-search-input",
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

export default PlacesToolbar;
