'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { useTranslation } from '@/hooks/useTranslation';
import { type TranslationKey } from '@/lib/i18n';

interface TranslatedTextProps {
  translationKey: TranslationKey | string;
  defaultValue?: string;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Component that automatically translates text based on current locale
 * 
 * Usage:
 * <TranslatedText translationKey="sidebar.home" />
 * <TranslatedText translationKey="common.save" as="button" />
 */
export function TranslatedText({ 
  translationKey, 
  defaultValue, 
  className = '',
  as: Component = 'span' 
}: TranslatedTextProps) {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <Component className={className}>
      {t(translationKey, defaultValue)}
    </Component>
  );
}
