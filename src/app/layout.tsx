import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Level Up Journey",
    description: "A platform to level up your skills",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
