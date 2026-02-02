import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CloudSentry AI - Demo",
    description: "AI-Powered Security Dashboard - Demo Mode",
};

export default function DemoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
