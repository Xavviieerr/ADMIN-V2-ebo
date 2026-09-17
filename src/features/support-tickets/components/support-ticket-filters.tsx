"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  SORT_OPTIONS,
  SORT_DIR_OPTIONS,
} from "../constants";

interface SupportTicketFiltersProps {
  search: string;
  status: string;
  category: string;
  sortBy: string;
  sortDir: string;
  onSearch: (search: string) => void;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: string, sortDir: string) => void;
}

export default function SupportTicketFilters({
  search,
  status,
  category,
  sortBy,
  sortDir,
  onSearch,
  onStatusChange,
  onCategoryChange,
  onSortChange,
}: SupportTicketFiltersProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState(search);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (inputValue !== search) {
        onSearch(inputValue);
      }
    }, 300);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
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

  const currentStatusLabel = STATUS_OPTIONS.find(o => o.value === status);
  const displayStatusLabel = currentStatusLabel ? t(currentStatusLabel.labelKey) : status;

  const currentCategoryLabel = CATEGORY_OPTIONS.find(o => o.value === category);
  const displayCategoryLabel = currentCategoryLabel ? t(currentCategoryLabel.labelKey) : category;

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy);
  const displaySortLabel = currentSortLabel ? t(currentSortLabel.labelKey) : sortBy;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder={t("supportTickets.searchPlaceholder")}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 bg-[#1E1E1E] border-[#23232a] text-[#f5f5f5]"
        />
      </div>

      <div className="relative" ref={statusDropdownRef}>
        <button
          type="button"
          onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#23232a] bg-[#1E1E1E] text-[#f5f5f5] hover:bg-[#23232a] transition-colors"
        >
          <span className="text-sm">{displayStatusLabel}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {statusDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-[#1E1E1E] border border-[#23232a] rounded-lg shadow-lg py-1 z-50">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onStatusChange(option.value);
                  setStatusDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  status === option.value
                    ? "bg-[#23232a] text-[#ffe6b0]"
                    : "text-gray-400 hover:bg-[#23232a] hover:text-[#f5f5f5]"
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={categoryDropdownRef}>
        <button
          type="button"
          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#23232a] bg-[#1E1E1E] text-[#f5f5f5] hover:bg-[#23232a] transition-colors"
        >
          <span className="text-sm">{displayCategoryLabel}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {categoryDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-[#1E1E1E] border border-[#23232a] rounded-lg shadow-lg py-1 z-50">
            {CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onCategoryChange(option.value);
                  setCategoryDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  category === option.value
                    ? "bg-[#23232a] text-[#ffe6b0]"
                    : "text-gray-400 hover:bg-[#23232a] hover:text-[#f5f5f5]"
                }`}
              >
                {t(option.labelKey)}
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
            {SORT_OPTIONS.map((option) => (
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
              {SORT_DIR_OPTIONS.map((option) => (
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
