import { RegisterForm } from "@/components/register-form";
import { type Locale } from "@/lib/i18n";

export default function Register({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterForm locale={locale} />
            </div>
        </div>
    );
}
