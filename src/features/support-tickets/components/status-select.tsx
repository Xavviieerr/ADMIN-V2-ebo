"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useUpdateSupportTicketStatusMutation } from "@/slice/requestSlice";
import { STATUS_OPTIONS, STATUS_COLORS } from "../constants";
import type { TicketStatus } from "../types";
import { ChevronDown } from "lucide-react";

interface StatusSelectProps {
  ticketId: string;
  currentStatus: TicketStatus;
  onStatusChange?: (newStatus: TicketStatus) => void;
}

export default function StatusSelect({ ticketId, currentStatus, onStatusChange }: StatusSelectProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateSupportTicketStatusMutation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (newStatus === currentStatus || isLoading) return;
    setIsOpen(false);
    try {
      await updateStatus({ id: ticketId, status: newStatus }).unwrap();
      onStatusChange?.(newStatus);
    } catch {
      // Error handled by RTK Query
    }
  };

  const currentLabel = STATUS_OPTIONS.find(o => o.value === currentStatus);
  const displayLabel = currentLabel ? t(currentLabel.labelKey) : currentStatus;
  const colorClass = STATUS_COLORS[currentStatus] ?? "text-gray-400";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#23232a] bg-[#1E1E1E] text-sm hover:bg-[#23232a] transition-colors disabled:opacity-50"
      >
        <span className={`w-2 h-2 rounded-full ${colorClass.replace("text-", "bg-")}`} />
        <span className={colorClass}>{displayLabel}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-[#1E1E1E] border border-[#23232a] rounded-lg shadow-lg py-1 z-50">
          {STATUS_OPTIONS.filter(o => o.value !== "all").map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleStatusChange(option.value as TicketStatus)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                currentStatus === option.value
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
  );
}
