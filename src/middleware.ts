import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, Locale, locales } from "./lib/i18n.server";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest): Locale {
    // Check if there is any supported locale in the pathname
    const pathname = request.nextUrl.pathname;
    const pathnameIsMissingLocale = locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // Try to get locale from Accept-Language header
        const acceptLanguage = request.headers.get("accept-language");

        if (acceptLanguage) {
            // Simple locale detection from Accept-Language header
            const preferredLocale = acceptLanguage
                .split(",")[0]
                .split("-")[0]
                .toLowerCase();

            if (locales.includes(preferredLocale as Locale)) {
                return preferredLocale as Locale;
            }
        }

        return defaultLocale;
    }

    // Extract locale from pathname
    const locale = pathname.split("/")[1];
    return (
        locales.includes(locale as Locale) ? locale : defaultLocale
    ) as Locale;
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        return NextResponse.redirect(
            new URL(`/${locale}${pathname}`, request.url),
        );
    }
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
