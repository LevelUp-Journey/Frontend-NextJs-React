import { LoginForm } from "@/components/login-form";
import { type Locale } from "@/lib/i18n";

export default async function LoginPage({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6 md:p-10 h-full flex-1">
            <div className="w-full max-w-sm">
                <LoginForm locale={locale} />
            </div>
        </div>
    );
}
