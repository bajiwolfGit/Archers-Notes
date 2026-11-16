import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Archer's Notes",
	description: "A collaborative note-sharing platform for students.",
	icons: {
        icon: "/assets/images/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}