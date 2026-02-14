"use client";

import HeroSection from "@/components/home/HeroSection";
import ExchangeCalculator from "@/components/home/ExchangeCalculator";
import MintFaucet from "@/components/home/MintFaucet";

export default function HomePage() {
  return (
    <section className="relative min-h-screen">
      {/* Gradient overlay for hero area */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep via-brand-deep/95 to-brand-navy/50 z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-12">
        <HeroSection />
        <ExchangeCalculator />
        <MintFaucet />
      </div>
    </section>
  );
}
