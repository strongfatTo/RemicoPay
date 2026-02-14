import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import NetworkBackground from "@/components/layout/NetworkBackground";
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
          {/* Animated particle network background */}
          <NetworkBackground />

          {/* Navigation */}
          <Navbar />

          {/* Main content */}
          <main className="relative z-10 pt-16">{children}</main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-white/5 py-8 mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
              <p className="text-sm text-white/40">
                © 2026 RemicoPay — Built on{" "}
                <a
                  href="https://www.etherlink.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-mint/60 hover:text-brand-mint transition-colors"
                >
                  Etherlink
                </a>
                . Fast. Secure. Stablecoin Remittance.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
