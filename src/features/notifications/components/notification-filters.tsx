"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { SlidersHorizontal, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  NOTIFICATION_SORT_OPTIONS,
  NOTIFICATION_SORT_DIR_OPTIONS,
  NOTIFICATION_TYPE_OPTIONS,
} from "../constants";

interface NotificationFiltersProps {
  search: string;
  type: string;
  sortBy: string;
  sortDir: string;
  onSearch: (search: string) => void;
  onTypeChange: (type: string) => void;
  onSortChange: (sortBy: string, sortDir: string) => void;
}

export default function NotificationFilters({
  search,
  type,
  sortBy,
  sortDir,
  onSearch,
  onTypeChange,
  onSortChange,
}: NotificationFiltersProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSortIcon = () => {
    if (sortDir === "DESC") return <ChevronDown className="h-4 w-4" />;
    if (sortDir === "ASC") return <ChevronUp className="h-4 w-4" />;
    return <ChevronsUpDown className="h-4 w-4" />;
  };

  const currentTypeLabel = NOTIFICATION_TYPE_OPTIONS.find(o => o.value === type);
  const displayTypeLabel = currentTypeLabel
    ? (currentTypeLabel.value === "all"
        ? t(currentTypeLabel.labelKey)
        : currentTypeLabel.labelKey)
    : type;

  const currentSortLabel = NOTIFICATION_SORT_OPTIONS.find(o => o.value === sortBy);
  const displaySortLabel = currentSortLabel ? t(currentSortLabel.labelKey) : sortBy;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search bar — commented out for now
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder={t("notifications.searchPlaceholder")}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 bg-[#1E1E1E] border-[#23232a] text-[#f5f5f5]"
        />
      </div>
      */}

      <div className="relative" ref={typeDropdownRef}>
        <button
          type="button"
          onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#23232a] bg-[#1E1E1E] text-[#f5f5f5] hover:bg-[#23232a] transition-colors"
        >
          <span className="text-sm">{displayTypeLabel}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${typeDropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {typeDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-[#1E1E1E] border border-[#23232a] rounded-lg shadow-lg py-1 z-50">
            {NOTIFICATION_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onTypeChange(option.value);
                  setTypeDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  type === option.value
                    ? "bg-[#23232a] text-[#ffe6b0]"
                    : "text-gray-400 hover:bg-[#23232a] hover:text-[#f5f5f5]"
                }`}
              >
                {option.value === "all" ? t(option.labelKey) : option.labelKey}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={sortDropdownRef}>
        <button
          type="button"
          onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#23232a] bg-[#1E1E1E] text-[#f5f5f5] hover:bg-[#23232a] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm">{displaySortLabel}</span>
          {getSortIcon()}
        </button>
        {sortDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-[#1E1E1E] border border-[#23232a] rounded-lg shadow-lg py-1 z-50">
            {NOTIFICATION_SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  const newSortDir = sortBy === option.value && sortDir === "DESC" ? "ASC" : "DESC";
                  onSortChange(option.value, newSortDir);
                  setSortDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  sortBy === option.value
                    ? "bg-[#23232a] text-[#ffe6b0]"
                    : "text-gray-400 hover:bg-[#23232a] hover:text-[#f5f5f5]"
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
            <div className="border-t border-[#23232a] mt-1 pt-1">
              {NOTIFICATION_SORT_DIR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSortChange(sortBy, option.value);
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    sortDir === option.value
                      ? "bg-[#23232a] text-[#ffe6b0]"
                      : "text-gray-400 hover:bg-[#23232a] hover:text-[#f5f5f5]"
                  }`}
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
