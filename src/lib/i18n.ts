export const defaultLocale = "en" as const;
export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

// Static imports for client-side usage
import enTranslations from './dictionaries/en.json';
import esTranslations from './dictionaries/es.json';

const translations = {
  en: enTranslations,
  es: esTranslations,
} as const;

// For client components - synchronous version
export function getDictionary(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}
