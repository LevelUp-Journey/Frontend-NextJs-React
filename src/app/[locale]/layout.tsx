import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/app-theme/theme-provider";
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

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
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
                    <div className="min-h-screen bg-background">{children}</div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
