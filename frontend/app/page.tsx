"use client";

import HeroSection from "@/components/home/HeroSection";
import ExchangeCalculator from "@/components/home/ExchangeCalculator";
import MintFaucet from "@/components/home/MintFaucet";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Features } from "@/components/features/Features";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const teamMembers = [
  {
    quote:
      "Major in FinTech and Digital Innovation, HKBU. Web3 infrastructure & digital asset tokenization intern at FORMS HK (Blockchain Valley@Cyberport). Built AI platform for 2,000+ employees. Compliance intern at Kena Finance — prepared AML, licensing, and PDPO documentation for a stablecoin payments startup.",
    name: "Ahtasham Ahmed",
    designation: "Founder & CEO",
    src: "https://cdn.gamma.app/mio4b0bgfmpw1ee/3dad9ab1f59640b2943ce72d65f43c88/optimized/WhatsApp-Tu-Xiang2025-10-05-Yu16.52.24_57310e24.avif",
  },
  {
    quote:
      "Major in FinTech and Digital Innovation, HKBU. 1-year intern at Kena Finance — stablecoin-based cross-border payments startup. Led user acquisition and testing in Philippines and Indonesia markets, built frontend, and resolved production bugs from user feedback.",
    name: "Chen Boyu, Dave",
    designation: "Founder & CTO",
    src: "https://cdn.gamma.app/mio4b0bgfmpw1ee/722fee062f0944d8bb00a4c11715e230/optimized/WhatsApp-Tu-Xiang2025-10-05-Yu16.59.17_cd6c82f7.avif",
  },
  {
    quote:
      "AI & Blockchain Systems, HKBU. Smart contract development & on-chain feature optimization & AI feature optimization. Built WeBond — an AI-powered platform connecting local and non-local communities. Hands-on experience engaging with migrant worker communities.",
    name: "Leung Man To, Thomas",
    designation: "R&D Team",
    src: "https://cdn.gamma.app/mio4b0bgfmpw1ee/c8307401ef6c4377952c042ad96c6afe/optimized/WhatsApp-Tu-Xiang2025-10-05-Yu16.57.39_e3630b97.avif",
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
      <section className="py-20 px-4 bg-brand-navy/30 border-t border-white/5 flex justify-center items-center overflow-hidden" id="rates">
        <RotatingEarth />
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-brand-deep border-t border-white/5" id="team">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-10 text-white">
          Our Team
        </h2>
        <AnimatedTestimonials testimonials={teamMembers} />
      </section>
    </div>
  );
}
