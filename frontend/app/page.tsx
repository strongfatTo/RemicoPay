"use client";

import HeroSection from "@/components/home/HeroSection";
import ExchangeCalculator from "@/components/home/ExchangeCalculator";
import MintFaucet from "@/components/home/MintFaucet";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Features } from "@/components/features/Features";
import { RatesTable } from "@/components/features/RatesTable";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const testimonials = [
  {
    quote:
      "RemicoPay transformed how I send money home. The fees are incredibly low compared to banks.",
    name: "Maria Santos",
    designation: "Domestic Worker",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Instant settlement on Etherlink is a game changer. My family gets the funds immediately.",
    name: "John Cruz",
    designation: "Software Engineer",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Transparent rates and no hidden fees. I know exactly how much PHP will arrive.",
    name: "Sarah Lee",
    designation: "Business Owner",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <AuroraBackground className="min-h-screen justify-start">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-12 w-full">
          <HeroSection />
          <ExchangeCalculator />
          <div className="mt-12">
            <MintFaucet />
          </div>
        </div>
      </AuroraBackground>

      {/* Features Section */}
      <section className="py-20 px-4 bg-brand-deep relative border-t border-white/5" id="features">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
              Why choose RemicoPay?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              We leverage blockchain technology to provide the fastest, cheapest, and most secure remittance service.
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* Rates Section */}
      <section className="py-20 px-4 bg-brand-navy/30 border-t border-white/5" id="rates">
        <RatesTable />
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-brand-deep border-t border-white/5" id="testimonials">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-10 text-white">
          Trusted by the Community
        </h2>
        <AnimatedTestimonials testimonials={testimonials} />
      </section>
    </div>
  );
}
