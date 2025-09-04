"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { getLocalizedPaths } from "@/lib/utils";
import { type Locale } from "@/lib/i18n";

interface AuthGuardProps {
    children: React.ReactNode;
    locale: Locale;
}

export function AuthGuard({ children, locale }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const localizedPaths = getLocalizedPaths(locale);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(localizedPaths.LOGIN);
        }
    }, [isAuthenticated, isLoading, router, localizedPaths.LOGIN]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Router will redirect to login
    }

    return <>{children}</>;
}
