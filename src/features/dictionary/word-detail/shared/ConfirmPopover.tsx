"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const ConfirmPopover = ({
  open,
  message,
  loading = false,
  confirmLabel = "Yes",
  cancelLabel = "No",
  tone = "danger",
  align = "right",
  className = "top-10",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  loading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "success";
  align?: "left" | "right";
  className?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={typeof message === "string" ? message : t("common.dictionary.confirmation", "Confirmation")}
      className={`space-y-2 z-50 px-5 py-4 text-sm absolute ${className} ${align === "left" ? "md:left-0 max-md:right-0" : "right-0"} w-64 max-w-[calc(100vw-2rem)] md:w-80 max-md:fixed max-md:left-1/2 max-md:top-[30%] max-md:-translate-x-1/2 max-md:w-80 max-h-[70vh] overflow-y-auto shadow-xl bg-secondary-bg border border-gray-txt-50/50 rounded-xl`}
    >
      <p>{message}</p>
      <div className="flex gap-2 justify-end">
        <button
          disabled={loading}
          onClick={onConfirm}
          className={
            tone === "success"
              ? "primary-btn bg-base-green text-white py-2 text-sm"
              : "primary-btn py-2 text-sm"
          }
        >
          {loading ? <Loader2 size={16} /> : confirmLabel === "Yes" ? t("common.yes", "Yes") : confirmLabel}
        </button>
        <button onClick={onCancel} className="secondary-btn py-2 text-sm">
          {cancelLabel === "No" ? t("common.no", "No") : cancelLabel}
        </button>
      </div>
    </div>
  );
};

export default ConfirmPopover;
