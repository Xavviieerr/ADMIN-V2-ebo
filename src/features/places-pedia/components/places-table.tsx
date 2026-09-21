"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import VirtualUrhoboKeyboard from "@/components/virtualUrhoboKeyboard";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown, Keyboard, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const placeTypes = [
  { label: "All Places", value: "all" },
  { label: "Villages", value: "villages" },
  { label: "Towns", value: "town" },
  { label: "Kingdoms", value: "kingdoms" },
];

type Place = {
  name: string;
  type: string;
  status: "approved" | "pending";
  founded: string;
};
const places: Place[] = [
  {
    name: "Otor-Udu",
    type: "Town",
    status: "approved",
    founded: "Pre-colonial Era",
  },
  {
    name: "Agbarha-Otor",
    type: "Kingdom",
    status: "approved",
    founded: "15th Century",
  },
  {
    name: "Effurun",
    type: "Urban Town",
    status: "pending",
    founded: "19th Century",
  },
  {
    name: "Ughelli",
    type: "Historic Town",
    status: "approved",
    founded: "16th Century",
  },
];

const PlacesTable: React.FC = () => {
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  const [searchTerm, setSearchTerm] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isFetching, _setIsFetching] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  return (
    <>
      <div className="flex max-sm:flex-col gap-4 w-full mt-10 mb-5">
        <div className="relative flex-1 max-w-100 w-full z-10">
          <input
            id="users-search-input"
            type="text"
            placeholder={t("common.searchPlaces")}
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
            <p>
              {placeTypes.find((item) => item.value === typeFilter)?.label ??
                "All Places"}
            </p>
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />

            {showOptions && (
              <div className="absolute top-full left-0 mt-2 w-full transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg">
                {placeTypes.map((item) => (
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
            onInput={(_text) => {
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

      <div className=" flex flex-col p-3 bg-gray-txt-100 rounded-md w-full mt-8">
        <table className="w-full min-w-[640px]">
          <thead className="bg-base-bg-50  border-b border-white/10 text-sm sm:text-base font-medium">
            <tr>
              <th className="p-5 text-left font-medium text-white rounded-l-md">
                {t("common.name")}
              </th>
              <th className="p-5  text-left font-medium text-white">
                {t("common.type")}
              </th>
              <th className="p-5 text-center font-medium text-white rounded-r-md">
                {t("common.founded")}
              </th>
              <th className="p-5 text-center font-medium text-white rounded-r-md">
                {t("common.status")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {places.map((item, index) => (
              <tr
                key={index}
                onClick={() => router.push(`/guonopedia/places/${index}`)}
                className="hover:bg-[#2a2a2a]/50 transition-colors capitalize cursor-pointer hover:underline "
              >
                <td className="p-6 text-sm text-white font-medium ">
                  {item.name}
                </td>
                <td className="p-6 text-sm text-white font-medium">
                  {item.type}
                </td>
                <td className="p-6 text-sm text-center text-white font-medium">
                  {item.founded}
                </td>
                <td
                  className={`p-6 text-sm text-center capitalize text-gray-300 ${
                    item.status.toLowerCase() === "approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PlacesTable;
