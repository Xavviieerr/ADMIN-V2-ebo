import { defaultLocale, isValidLocale, type Locale } from './config';

/**
 * Get locale from request or use default
 * This is a utility function for server-side locale handling
 */
export async function getRequestLocale(requestLocale?: string | null): Promise<Locale> {
  // Ensure that a valid locale is used
  if (!requestLocale || !isValidLocale(requestLocale)) {
    return defaultLocale;
  }
  return requestLocale;
}

/**
 * Load messages for a given locale
 */
export async function getLocaleMessages(locale: Locale) {
  try {
    const messages = await import(`../locales/${locale}/common.json`);
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to default locale
    const fallback = await import(`../locales/${defaultLocale}/common.json`);
    return fallback.default;
  }
}
