export default function HeaderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <header className="flex items-center justify-between px-6 py-4">
            {children}
        </header>
    );
}
