import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/app-theme/theme-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Locale, locales } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: Locale };
}) {
    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="min-h-screen">
                        <header className="fixed top-4 right-4 z-50">
                            <LanguageSwitcher />
                        </header>
                        {children}
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
