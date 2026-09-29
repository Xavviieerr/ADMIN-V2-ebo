"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
const LocaleWrapper = ({
  item,
  fallback,
}: {
  item: string;
  fallback?: string;
}) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return t(item, fallback ?? item);
};

export default LocaleWrapper;
