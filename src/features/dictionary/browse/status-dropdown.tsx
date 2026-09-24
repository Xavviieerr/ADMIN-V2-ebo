"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "In-Review", value: "in-review" },
  { label: "Rejected", value: "rejected" },
];

const StatusDropdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStatus = searchParams.get("status") ?? "";

  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showOptions) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showOptions]);

  const handleStatus = (value: string) => {
    setShowOptions(false);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("page");

    if (value && value !== "all") {
      currentParams.set("status", value);
    } else {
      currentParams.delete("status");
    }

    const newPath = `/guonopedia/dictionary?${currentParams.toString()}`;
    router.replace(newPath);
  };

  return (
    <div className="flex items-center gap-5 text-sm">
      <div
        ref={dropdownRef}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={showOptions}
        aria-label="Filter by status"
        onClick={() => setShowOptions(!showOptions)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowOptions(!showOptions);
          }
          if (e.key === "Escape") {
            setShowOptions(false);
          }
        }}
        className="flex items-center justify-between gap-4 min-w-30 relative bg-gray-txt-100 focus:ring-1 ring-foreground-50 px-5 py-3 rounded-lg outline-none cursor-pointer"
      >
        <p>Status</p>
        <ChevronDown
          className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${showOptions ? "rotate-180" : ""}`}
        />

        {showOptions && (
          <div
            role="listbox"
            aria-label="Status options"
            className="absolute top-full left-0 mt-2 w-full min-w-52 max-h-72 overflow-y-auto z-20 transition-all ease-in-out bg-secondary-bg rounded-lg shadow-lg"
          >
            {statusOptions.map((item) => {
              const selected =
                item.value === "all"
                  ? !activeStatus
                  : activeStatus === item.value;
              return (
                <button
                  key={item.value}
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleStatus(item.value)}
                  className={`w-full text-left px-5 py-3 hover:bg-gray-txt-100 cursor-pointer ${selected ? "text-foreground-50 font-medium" : ""}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDropdown;
