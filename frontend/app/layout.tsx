import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import NetworkBackground from "@/components/layout/NetworkBackground";
import { Footer } from "@/components/layout/Footer";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "RemicoPay — Fast. Secure. Stablecoin Remittance.",
  description:
    "Send HKD to PHP remittances instantly using stablecoins on Etherlink. Low fees, transparent exchange rates, fully on-chain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-brand-deep text-white">
        <Providers>
          {/* Animated particle network background - kept for consistency but can be removed if needed */}
          {/* <NetworkBackground /> */}

          {/* Navigation */}
          <Navbar />

          {/* Main content */}
          <main className="relative z-10">{children}</main>

          {/* Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
