"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserController } from "@/services/iam/user.controller";
import { OAuthCallbackRequest } from "@/services/iam/user.request";
import { useAuth } from "@/lib/hooks/use-auth";
import { getDictionary, type Locale } from "@/lib/i18n";
import PATHS from "@/lib/paths";

export default function GoogleCallbackPage({
    params,
}: {
    params: { locale: Locale };
}) {
    const { locale } = params;
    const dict = getDictionary(locale);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const error = searchParams.get("error");

            if (error) {
                console.error("OAuth error:", error);
                toast.error(dict["login.error.generic"]);
                router.push(`/${locale}${PATHS.LOGIN}`);
                return;
            }

            if (!code) {
                toast.error(dict["login.error.generic"]);
                router.push(`/${locale}${PATHS.LOGIN}`);
                return;
            }

            try {
                const request: OAuthCallbackRequest = {
                    code,
                    state: state || undefined,
                    provider: "google",
                };

                const response = await UserController.handleGoogleOAuthCallback(request);

                if (response.success && response.data) {
                    login(
                        response.data.token || "",
                        response.data.refreshToken,
                        response.data.user
                    );

                    toast.success(dict["login.success"]);
                    router.push(`/${locale}${PATHS.DASHBOARD}`);
                } else {
                    toast.error(response.error || dict["login.error.generic"]);
                    router.push(`/${locale}${PATHS.LOGIN}`);
                }
            } catch (error) {
                console.error("Google OAuth callback error:", error);
                toast.error(dict["login.error.generic"]);
                router.push(`/${locale}${PATHS.LOGIN}`);
            }
        };

        handleCallback();
    }, [searchParams, router, login, dict, locale]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="mb-4 text-xl font-bold">
                    {dict["login.loading"]}
                </h1>
                <p className="text-muted-foreground">
                    Processing Google authentication...
                </p>
            </div>
        </div>
    );
}
