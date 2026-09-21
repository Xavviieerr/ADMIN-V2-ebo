/**
 * i18n utility functions and configuration
 * 
 * This file provides helper functions for internationalization
 * supporting Urhobo (urh) and English (en) translations
 */

export type Locale = 'en' | 'urh';

export const locales: Locale[] = ['en', 'urh'];
export const defaultLocale: Locale = 'en';

/**
 * Load translations for a specific locale
 */
export async function getTranslations(locale: Locale = defaultLocale) {
  try {
    const translations = await import(`../locales/${locale}/common.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    // Fallback to English
    const fallback = await import(`../locales/${defaultLocale}/common.json`);
    return fallback.default;
  }
}

/**
 * Get translation value by key path (e.g., 'sidebar.home')
 */
export function getTranslation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations: Record<string, any>,
  key: string,
  defaultValue?: string
): string {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return defaultValue || key;
    }
  }

  return typeof value === 'string' ? value : defaultValue || key;
}

/**
 * Type-safe translation keys
 */
export type TranslationKey =
  | `sidebar.${string}`
  | `common.${string}`
  | `users.${string}`
  | `messages.${string}`
  | `login.${string}`
  | `forgotPassword.${string}`
  | `changePassword.${string}`
  | `profile.${string}`
  | `home.${string}`;
