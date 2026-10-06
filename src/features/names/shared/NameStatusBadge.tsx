"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const STATUS_STYLES: Record<string, string> = {
  approved: "text-green-600",
  pending: "text-yellow-600",
  rejected: "text-red-600",
};

const STATUS_KEYS: Record<string, { key: string; fallback: string }> = {
  approved: { key: "common.approved", fallback: "Approved" },
  pending: { key: "common.dictionary.pending", fallback: "Pending" },
  rejected: { key: "common.dictionary.rejected", fallback: "Rejected" },
};

export function NameStatusBadge({
  status,
  className,
}: {
  status: string | null | undefined;
  className?: string;
}) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  const key = (status ?? "").toLowerCase();
  const entry = STATUS_KEYS[key];
  return (
    <span className={cn("capitalize", STATUS_STYLES[key] ?? "text-gray-300", className)}>
      {entry ? t(entry.key, entry.fallback) : (status ?? "—")}
    </span>
  );
}
