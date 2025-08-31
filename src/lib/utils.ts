import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Locale } from "./i18n";
import PATHS from "./paths";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Create locale-aware paths
export const getLocalizedPath = (path: string, locale: Locale) => {
    if (path === "/") return `/${locale}`;
    return `/${locale}${path}`;
};

export const getLocalizedPaths = (locale: Locale) => ({
    HOME: getLocalizedPath(PATHS.HOME, locale),
    LOGIN: getLocalizedPath(PATHS.LOGIN, locale),
    REGISTER: getLocalizedPath(PATHS.REGISTER, locale),
    TERMS: getLocalizedPath(PATHS.TERMS, locale),
    PRIVACY: getLocalizedPath(PATHS.PRIVACY, locale),
});
