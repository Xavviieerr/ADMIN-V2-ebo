"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";

const TranslatingFrom = ({ value }: { value?: string }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);
  if (!value || !value.trim()) return null;
  return (
    <p className="text-xs text-gray-txt-50">
      {t("common.dictionary.translatingFrom", "Translating from")}: “{value}”
    </p>
  );
};

export default TranslatingFrom;
