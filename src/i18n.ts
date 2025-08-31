import "server-only";

export const defaultLocale = "en" as const;
export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const translations = {
    en: () => import("./dictionaries/en.json").then((module) => module.default),
    es: () => import("./dictionaries/es.json").then((module) => module.default),
} as const;

export function getDictionary(locale: Locale) {
    return translations[locale] || translations[defaultLocale];
}
