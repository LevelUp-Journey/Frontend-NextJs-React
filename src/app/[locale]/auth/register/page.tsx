import { RegisterForm } from "@/components/register-form";
import { type Locale } from "@/lib/i18n";

export default async function Register({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;

    return (
        <div className="bg-background flex flex-col items-center justify-center gap-6 p-6 md:p-10 flex-1">
            <div className="w-full max-w-sm">
                <RegisterForm locale={locale} />
            </div>
        </div>
    );
}
