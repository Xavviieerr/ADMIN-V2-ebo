"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import VirtualUrhoboKeyboard from "@/components/virtualUrhoboKeyboard";
import { useLocale } from "@/contexts/LocaleContext";
import { NameRecord } from "@/features/shared";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown, Keyboard, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const nameTypes = [
  { label: "All Names", value: "all" },
  { label: "First Names", value: "first" },
  { label: "Last Names", value: "last" },
];

const NamesTable: React.FC<{ data: NameRecord; page: number }> = ({
  data,
  page,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [typeFilter, setTypeFilter] = useState(
    searchParams.get("type") || "all",
  );
  const [isFetching, setIsFetching] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const debouncedValue = useDebounce(searchTerm.trim(), 500);

  useEffect(() => {
    router.replace(
      `/guonopedia/names?page=${page}&search=${debouncedValue}&type=${typeFilter}`,
      { scroll: false },
    );
  }, [debouncedValue]);

  return (
    <>
      <div className="flex max-sm:flex-col gap-4 w-full mt-10 mb-5">
        <div className="relative flex-1 max-w-100 w-full z-10">
          <input
            id="users-search-input"
            type="text"
            placeholder={t("common.searchNames")}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="input pl-10 pr-16"
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
              aria-label="Toggle keyboard"
              title="Virtual Keyboard"
            >
              <Keyboard className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {searchTerm && !isFetching && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                }}
                className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Clear search"
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

        <div className="flex items-center gap-5">
          <div
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center justify-between gap-4 min-w-30 relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
          >
            <p>{nameTypes.find((item) => item.value === typeFilter)?.label}</p>
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />

            {showOptions && (
              <div className="absolute top-full left-0 mt-2 w-full transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg">
                {nameTypes.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setTypeFilter(item.value);
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
        </div>

        {showKeyboard && (
          <VirtualUrhoboKeyboard
            targetInputId="users-search-input"
            onInput={(text) => {
              // The keyboard will update the input directly via targetInputId
              // This callback is for additional handling if needed
              const targetInput = document.getElementById(
                "users-search-input",
              ) as HTMLInputElement;
              if (targetInput) {
                setSearchTerm(targetInput.value);
                //   if (typeof window !== "undefined") {
                //     localStorage.setItem(
                //       STORAGE_KEY_USERS_SEARCH,
                //       targetInput.value,
                //     );
                //   }
              }
            }}
            onClose={() => setShowKeyboard(false)}
          />
        )}
      </div>

      <div className="flex max-md:hidden flex-col p-3 bg-gray-txt-100 rounded-md w-full mt-8">
        <table className="w-full min-w-[640px]">
          <thead className="bg-base-bg-50  border-b border-white/10 text-sm sm:text-base font-medium">
            <tr>
              <th className="p-5 text-left font-medium text-white rounded-l-md">
                {t("common.name")}
              </th>
              <th className="p-5  text-center font-medium text-white">
                {t("common.type")}
              </th>
              <th className="p-5  text-center font-medium text-white">
                {t("common.gender")}
              </th>
              <th className="p-5 text-right font-medium text-white rounded-r-md">
                {t("common.status")}
              </th>
            </tr>
          </thead>

          {data && data.items && data.items.length > 0 && (
            <tbody className="divide-y divide-white/10">
              {data.items.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => router.push(`/guonopedia/names/${item.id}`)}
                  className="hover:bg-[#2a2a2a]/50 transition-colors capitalize cursor-pointer hover:underline "
                >
                  <td className="p-6 text-sm text-white font-medium ">
                    {item.name}
                  </td>
                  <td className="p-6 text-sm text-white text-center font-medium">
                    {item.nameType.toLowerCase().includes("given")
                      ? "First Name"
                      : "Last Name"}
                  </td>
                  <td className="p-6 text-sm text-white text-center font-medium">
                    {item.gender}
                  </td>
                  <td
                    className={`p-6 text-sm text-right capitalize text-gray-300 ${
                      item.status.toLowerCase() === "approved"
                        ? "text-green-600"
                        : item.status.toLowerCase() === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {(!data || !data.items || !data.items.length) && (
        <p className="text-center w-full mt-10 pb-6 ">No names found</p>
      )}

      <div className="flex flex-col gap-4">
        {data &&
          data.items &&
          data.items.length > 0 &&
          data.items.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/guonopedia/names/${item.id}`)}
              className="md:hidden bg-[#1E1E1E] rounded-lg border border-white/10 p-4 space-y-3 cursor-pointer hover:bg-[#2a2a2a]/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-white truncate capitalize">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">
                    {item.nameType.toLowerCase().includes("given")
                      ? "First Name"
                      : "Last Name"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {t("common.gender", "Gender")}:
                  </span>
                  <span className="text-xs sm:text-sm text-gray-300 capitalize">
                    {item.gender}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {t("common.statusLabel")}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-medium capitalize ${
                      item.status === "approved"
                        ? "text-green-400"
                        : item.status === "pending"
                          ? "text-yellow-600"
                          : "text-base-red"
                    }`}
                  >
                    {item.status === "approved"
                      ? t("common.approved")
                      : item.status === "pending"
                        ? t("common.pending")
                        : item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default NamesTable;
