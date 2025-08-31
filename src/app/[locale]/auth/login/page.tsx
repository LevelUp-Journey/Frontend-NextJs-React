import { LoginForm } from "@/components/login-form";
import { type Locale } from "@/lib/i18n";

export default async function LoginPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm locale={locale} />
            </div>
        </div>
    );
}
