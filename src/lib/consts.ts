import { type Locale } from "./i18n";

const DEFAULTS = {
    APP_NAME: "Level Up Journey",
}

const PATHS = {
    HOME: "/",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    TERMS: "/terms",
    PRIVACY: "/privacy",
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

export default DEFAULTS;
export { PATHS };