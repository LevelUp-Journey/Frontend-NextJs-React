import { AuthGuard } from "@/components/auth-guard";
import { DashboardHeader } from "@/components/dashboard-header";
import { type Locale } from "@/lib/i18n";

export default function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: Locale };
}) {
    return (
        <AuthGuard locale={params.locale}>
            <div className="min-h-screen bg-background">
                <DashboardHeader />
                <main className="container mx-auto py-6">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
