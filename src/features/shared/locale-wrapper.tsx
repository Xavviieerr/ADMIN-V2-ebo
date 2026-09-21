"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
const LocaleWrapper = ({ item }: { item: string }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return t(item);
};

export default LocaleWrapper;
