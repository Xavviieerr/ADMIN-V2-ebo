"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

export interface DropdownOption {
  value: string;
  label: string;
}

interface FormDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange: (value: string) => void;
}

export default function FormDropdown({
  label,
  value,
  options,
  placeholder,
  disabled,
  loading,
  onChange,
}: FormDropdownProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) setFilter("");
  }, [open ]);

  const selected = options.find((o) => o.value === value);
  const visibleOptions = options.filter((o) =>
    o.label.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="flex flex-col items-start gap-2" ref={rootRef}>
      <span className="text-sm text-gray-400">{label}</span>
      <div className="relative w-full">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => setOpen(!open)}
          className="input flex items-center justify-between text-left disabled:opacity-50"
        >
          <span className={selected ? "text-white" : "text-gray-500"}>
            {selected?.label ??
              placeholder ??
              t("profile.selectPlaceholder", "Select...")}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && !disabled && !loading && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-56 overflow-hidden rounded-lg bg-[#23232a] border border-white/10 shadow-lg flex flex-col">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
              <Search size={14} className="text-gray-500 shrink-0" />
              <input
                autoFocus
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={t("profile.searchPlaceholder", "Search...")}
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div className="overflow-y-auto">
              {visibleOptions.length === 0 && (
                <p className="px-4 py-3 text-sm text-gray-500">
                  {t("profile.noResults", "No results found")}
                </p>
              )}
              {visibleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${
                    option.value === value ? "text-[#F5DEB3]" : "text-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
