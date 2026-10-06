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
  NAME_TYPE_OPTIONS,
  STATUS_FILTER_OPTIONS,
  type FilterOption,
} from "../model/constants";
import type { ToolbarFilters } from "../model/types";

function readFilters(searchParams: URLSearchParams): ToolbarFilters {
  return {
    search: searchParams.get("search") ?? "",
    nameType: searchParams.get("nameType") ?? "",
    status: searchParams.get("status") ?? "",
    sortDir: searchParams.get("sortDir") ?? "ASC",
  };
}

// Search + filter toolbar. Deliberately independent of list data so it stays
// mounted (and usable) even when the results request fails — the toolbar
// disappearing on error was the reported "filter disappears" bug.
const NamesToolbar: React.FC = () => {
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
  const [nameType, setNameType] = useState(initial.nameType);
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
    setNameType(next.nameType);
    setStatus(next.status);
    setSortDir(next.sortDir);
  }, [searchParams]);

  const writeUrl = (next: ToolbarFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.search) params.set("search", next.search);
    else params.delete("search");
    if (next.nameType) params.set("nameType", next.nameType);
    else params.delete("nameType");
    if (next.status) params.set("status", next.status);
    else params.delete("status");
    params.set("sortDir", next.sortDir || "ASC");
    // Legacy param is superseded by nameType; drop it so URLs stay canonical.
    params.delete("type");
    // Search/filter changes restart at page 1 (avoids stale-page resets).
    params.set("page", "1");
    appliedKey.current = params.toString();
    startTransition(() => {
      router.replace(`/guonopedia/names?${params.toString()}`, { scroll: false });
    });
  };

  // Debounced search → URL (URLSearchParams encodes special chars).
  const lastPushedSearch = useRef(debouncedValue);
  useEffect(() => {
    if (debouncedValue === lastPushedSearch.current) return;
    lastPushedSearch.current = debouncedValue;
    writeUrl({ search: debouncedValue, nameType, status, sortDir });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleDropdownChange = (patch: Partial<ToolbarFilters>) => {
    const next = { search: debouncedValue, nameType, status, sortDir, ...patch };
    if (patch.nameType !== undefined) setNameType(patch.nameType);
    if (patch.status !== undefined) setStatus(patch.status);
    if (patch.sortDir !== undefined) setSortDir(patch.sortDir);
    writeUrl(next);
  };

  return (
    <div className="flex max-md:flex-col max-md:gap-5 gap-3 w-full justify-between mt-10 mb-5">
      <div className="relative flex-1 max-w-100 w-full z-10">
        <label htmlFor="names-search-input" className="sr-only">
          {t("common.searchNames")}
        </label>
        <input
          id="names-search-input"
          type="search"
          placeholder={t("common.searchNames")}
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
            <div role="status" aria-label={t("names.a11y.searching", "Searching")}>
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </div>

      <div className="flex max-md:flex-col-reverse max-md:items-stretch items-center gap-5">
        <FilterDropdown
          id="names-type-filter"
          prefix={t("common.type", "Type")}
          value={nameType}
          options={tx(NAME_TYPE_OPTIONS)}
          onChange={(value) => handleDropdownChange({ nameType: value })}
        />
        <FilterDropdown
          id="names-status-filter"
          prefix={t("common.status", "Status")}
          value={status}
          options={tx(STATUS_FILTER_OPTIONS)}
          onChange={(value) => handleDropdownChange({ status: value })}
        />
        {/* TODO(sortDir): Order control paused until product confirms sort UX.
            sortDir stays at its default ("ASC") in state and URLs meanwhile.
        <FilterDropdown
          id="names-sort-filter"
          prefix="Order"
          value={sortDir}
          options={SORT_DIR_OPTIONS}
          onChange={(value) => handleDropdownChange({ sortDir: value })}
        />
        */}
      </div>

      {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId="names-search-input"
          onInput={() => {
            const targetInput = document.getElementById(
              "names-search-input",
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

export default NamesToolbar;
