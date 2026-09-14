"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";

const LocaleWrapper = ({ item }: { item: string }) => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return t(item);
};

export default LocaleWrapper;
