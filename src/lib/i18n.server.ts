import 'server-only'

export const defaultLocale = "en" as const;
export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
} as const;

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]() || dictionaries[defaultLocale]();
