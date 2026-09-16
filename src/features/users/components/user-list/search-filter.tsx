"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import VirtualUrhoboKeyboard from "@/components/virtualUrhoboKeyboard";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useKeyboard } from "@/features/shared/components/keyboard-context";
import { Keyboard, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  STATUS_FILTER_OPTIONS,
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
  CONTRIBUTOR_STATUS_FILTER_OPTIONS,
  CONTRIBUTOR_SORT_BY_OPTIONS,
} from "../../constants";
import SortDropdown from "./sort-dropdown";

const SearchFilter = ({
  searchTerm,
  isFetching,
  handleSearchChange,
  handleSearchText,
  clearSearch,
  handleStatusFilterChange,
  sortBy,
  sortOrder,
  handleSortByChange,
  handleSortOrderChange,
  isContributorsView,
}: {
  searchTerm: string;
  isFetching: boolean;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchText: (text: string) => void;
  clearSearch: () => void;
  handleStatusFilterChange: (status: string) => void;
  sortBy: string;
  sortOrder: string;
  handleSortByChange: (value: string) => void;
  handleSortOrderChange: (value: string) => void;
  isContributorsView?: boolean;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const { setActiveField } = useKeyboard();

  const [statusFilter, setStatusFilter] = useState("all");
  const valueRef = useRef(searchTerm);
  const cursorRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const statusOptions = isContributorsView
    ? CONTRIBUTOR_STATUS_FILTER_OPTIONS
    : STATUS_FILTER_OPTIONS;
  const sortByOptions = isContributorsView
    ? CONTRIBUTOR_SORT_BY_OPTIONS
    : SORT_BY_OPTIONS;

  useEffect(() => {
    valueRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    const storedStatus = localStorage.getItem("users_status_filter");
    if (storedStatus !== null && storedStatus !== statusFilter) {
      setStatusFilter(storedStatus);
      handleStatusFilterChange(storedStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showOptions) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  return (
    <div className="flex max-md:flex-col max-md:gap-5 gap-3 w-full justify-between mb-6 mt-10">
      <div className="relative flex-1 max-w-100 w-full z-10">
        <label htmlFor="users-search-input" className="sr-only">
          {t("common.searchUsers")}
        </label>
        <input
          ref={inputRef}
          id="users-search-input"
          type="text"
          placeholder={t("common.searchUsers")}
          value={searchTerm}
          onChange={(e) => {
            handleSearchChange(e);
          }}
          onSelect={(e) => {
            cursorRef.current = e.currentTarget.selectionStart ?? searchTerm.length;
          }}
          onFocus={(e) => {
            cursorRef.current = e.currentTarget.selectionStart ?? searchTerm.length;
            setActiveField({
              getValue: () => valueRef.current,
              setValue: (val) => {
                handleSearchText(val);
              },
              getCursorPos: () => cursorRef.current,
              setCursorPos: (pos) => {
                inputRef.current?.focus();
                inputRef.current?.setSelectionRange(pos, pos);
                cursorRef.current = pos;
              },
            });
          }}
          onBlur={() => setActiveField(null)}
          className="w-full rounded-lg bg-gray-txt-100 py-3 pl-10 pr-20 text-gray-200 placeholder-gray-400 outline-none focus:ring-1 focus:ring-foreground-50 text-base"
        />
        <svg
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
            title={t("common.virtualKeyboard", "Virtual Keyboard")}
          >
            <Keyboard className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {searchTerm && !isFetching && (
            <button
              type="button"
              onClick={() => {
                clearSearch();
              }}
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label={t("common.clearSearch", "Clear search")}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
          {isFetching && (
            <div>
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </div>

      <div className="flex max-md:flex-col-reverse max-md:items-end items-center gap-5">
        <div
          ref={statusRef}
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={showOptions}
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
          <p>{statusOptions.find((item) => item.value === statusFilter)?.label || "All"}</p>
          <span className="h-4 w-4 sm:h-5 sm:w-5" />

          {showOptions && (
            <div
              role="listbox"
              className="absolute top-full left-0 mt-2 w-full transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg"
            >
              {statusOptions.map((item) => (
                <button
                  key={item.value}
                  role="option"
                  aria-selected={item.value === statusFilter}
                  onClick={() => {
                    setStatusFilter(item.value);
                    handleStatusFilterChange(item.value);
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <SortDropdown
          label={t("common.sortBy", "Sort by")}
          options={sortByOptions}
          value={sortBy}
          onChange={handleSortByChange}
        />
        <SortDropdown
          label={t("common.sortOrder", "Order")}
          options={SORT_ORDER_OPTIONS}
          value={sortOrder}
          onChange={handleSortOrderChange}
        />
      </div>

      {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId="users-search-input"
          onInput={() => {
            const targetInput = document.getElementById(
              "users-search-input",
            ) as HTMLInputElement;
            if (targetInput) {
              handleSearchText(targetInput.value);
            }
          }}
          onClose={() => setShowKeyboard(false)}
        />
      )}
    </div>
  );
};

export default SearchFilter;
