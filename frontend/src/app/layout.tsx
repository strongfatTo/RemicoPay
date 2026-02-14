import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
    title: "RemicoPay - Instant HKD to PHP Remittance",
    description: "Send money to the Philippines instantly with low fees using stablecoins.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body
                className={cn(
                    inter.variable,
                    spaceGrotesk.variable,
                    "font-sans min-h-screen aurora-bg overflow-x-hidden"
                )}
                suppressHydrationWarning
            >
                <Providers>
                    <Navbar />
                    <main className="relative z-10 min-h-screen flex flex-col pt-24">
                        {children}
                    </main>
                    {/* Ambient background glow effects */}
                    <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
                    <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none z-0" />
                </Providers>
            </body>
        </html>
    );
}
