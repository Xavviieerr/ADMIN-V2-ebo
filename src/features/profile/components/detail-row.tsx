"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  valueClassName?: string;
}

export default function DetailRow({
  icon: Icon,
  label,
  value,
  valueClassName = "text-white",
}: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 min-w-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5DEB3]/10 text-[#F5DEB3]">
        <Icon size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">
          {label}
        </span>
        <span className={`mt-0.5 block truncate text-sm font-medium ${valueClassName}`}>
          {value}
        </span>
      </span>
    </div>
  );
}
