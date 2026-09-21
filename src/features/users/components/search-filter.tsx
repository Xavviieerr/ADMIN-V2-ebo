"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import VirtualUrhoboKeyboard from "@/components/virtualUrhoboKeyboard";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown, Keyboard, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const statusList = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "suspended",
    label: "Suspended",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];

const SearchFilter: React.FC<{
  isFetching: boolean;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  handleStatusFilterChange: (status: string) => void;
}> = ({
  isFetching,
  handleSearchChange,
  clearSearch,
  handleStatusFilterChange,
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const [showOptions, setShowOptions] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    const storedSearch = localStorage.getItem("users_search");
    const storedStatus = localStorage.getItem("users_status_filter");
    if (storedSearch !== null && storedSearch !== searchTerm) {
      setSearchTerm(storedSearch);
    }
    if (storedStatus !== null && storedStatus !== statusFilter) {
      setStatusFilter(storedStatus);
      handleStatusFilterChange(storedStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex max-md:flex-col max-md:gap-5 gap-3 w-full justify-between mb-6 mt-10">
      <div className="relative flex-1 max-w-100 w-full z-10">
        <input
          id="users-search-input"
          type="text"
          placeholder={t("common.searchUsers")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearchChange(e);
            localStorage.setItem("users_search", e.target.value);
          }}
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
                localStorage.setItem("users_search", "");
                clearSearch();
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

      <div className="flex max-md:flex-col-reverse max-md:items-end items-center gap-5">
        <div
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center justify-between gap-4 min-w-30 relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
        >
          <p>{statusList.find((item) => item.value === statusFilter)?.label}</p>
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />

          {showOptions && (
            <div className="absolute top-full left-0 mt-2 w-full transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg">
              {statusList.map((item) => (
                <button
                  key={item.value}
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

        <div className="flex w-full items-center gap-3">
          <input
            type="date"
            value={dateFilter.startDate}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, startDate: e.target.value })
            }
            max={new Date().toISOString().split("T")[0]}
            className="bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none w-[45%]"
          />

          <Image
            src={"/date-arrow.svg"}
            alt="date-arrow"
            width={20}
            height={6}
          />
          <input
            type="date"
            value={dateFilter.endDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, endDate: e.target.value })
            }
            className="bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none w-[45%]"
          />
        </div>
      </div>

      {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId="users-search-input"
          onInput={() => {
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
  );
};

export default SearchFilter;
