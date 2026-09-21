'use client';

import { useState, useEffect } from 'react';
import { getTranslations, getTranslation, type Locale, type TranslationKey } from '@/lib/i18n';

/**
 * Custom hook for translations
 * 
 * Usage:
 * const t = useTranslation('en');
 * const homeText = t('sidebar.home');
 */
export function useTranslation(locale: Locale = 'en') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const trans = await getTranslations(locale);
        setTranslations(trans);
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTranslations();
  }, [locale]);

  const t = (key: TranslationKey | string, defaultValue?: string): string => {
    if (loading || !translations) {
      return defaultValue || key;
    }
    return getTranslation(translations, key, defaultValue);
  };

  return { t, loading, locale };
}

/**
 * Simple translation function for use outside React components
 */
export async function translate(
  locale: Locale,
  key: TranslationKey | string,
  defaultValue?: string
): Promise<string> {
  const translations = await getTranslations(locale);
  return getTranslation(translations, key, defaultValue);
}
