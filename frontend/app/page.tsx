"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import ExchangeCalculator from "@/components/home/ExchangeCalculator";
import MintFaucet from "@/components/home/MintFaucet";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProtocolSection from "@/components/home/ProtocolSection";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Check } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

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
      "AI & Blockchain Systems, HKBU. Smart contract development & on-chain feature optimization. Built WeBond — an AI-powered platform connecting local and non-local communities. Hands-on experience engaging with migrant worker communities.",
    name: "Leung Man To, Thomas",
    designation: "R&D Team",
    src: "https://cdn.gamma.app/mio4b0bgfmpw1ee/c8307401ef6c4377952c042ad96c6afe/optimized/WhatsApp-Tu-Xiang2025-10-05-Yu16.57.39_e3630b97.avif",
  },
];

const pricingTiers = [
  {
    name: "Essential",
    fee: "0.5%",
    desc: "For individuals sending occasional remittances.",
    features: ["Up to 5,000 HKDR / month", "Standard rate", "Email support"],
    cta: "Get Started",
    accent: false,
  },
  {
    name: "Performance",
    fee: "0.7%",
    desc: "Best for regular senders who need live rates and priority.",
    features: ["Unlimited HKDR", "Live on-chain rate", "Priority settlement", "24/7 support"],
    cta: "Send Money Now",
    accent: true,
  },
  {
    name: "Enterprise",
    fee: "Custom",
    desc: "For businesses, NGOs, or high-volume corridors.",
    features: ["Custom fee structure", "Dedicated relay node", "Compliance reporting", "SLA guarantee"],
    cta: "Contact Us",
    accent: false,
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────────────────────────── */

function Section({
  id,
  className = "",
  style,
  children,
}: {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-28 px-4 ${className}`} style={style}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: "rgba(201,168,76,0.35)" }} />
      <span
        className="text-xs uppercase tracking-[0.2em] font-medium"
        style={{ color: "#C9A84C", fontFamily: "'JetBrains Mono', monospace" }}
      >
        {text}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────────── */

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden"
    >
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1800&q=80')",
        }}
      />
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, #0D0D12 0%, rgba(13,13,18,0.85) 40%, rgba(13,13,18,0.4) 100%)",
        }}
      />
      {/* Additional left-side gradient for text contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(13,13,18,0.7) 0%, transparent 70%)",
        }}
      />

      {/* Content — bottom-left third */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-20 pt-32">
        <div className="max-w-2xl">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest border"
            style={{
              backgroundColor: "rgba(201,168,76,0.1)",
              borderColor: "rgba(201,168,76,0.3)",
              color: "#C9A84C",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#C9A84C" }}
            />
            Live on Etherlink Testnet
          </motion.div>

          {/* Headline — bold sans + massive serif italic */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-heading font-bold tracking-tight mb-4 leading-[1.05]"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            <span style={{ color: "#FAF8F5" }}>Remittance meets</span>
            <br />
            <span
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: "italic",
                color: "#C9A84C",
                fontSize: "1.12em",
              }}
            >
              Precision.
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-base md:text-lg mb-10 leading-relaxed max-w-lg"
            style={{ color: "rgba(250,248,245,0.55)" }}
          >
            Send HKD to PHP in seconds — not days. Best on-chain exchange rates,
            zero hidden fees, permanently verifiable on Etherlink.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center gap-4 flex-wrap"
          >
            <Link href="/send">
              <button className="btn-neon relative overflow-hidden text-sm px-8 py-3.5 font-semibold">
                <span className="btn-slide" />
                <span className="relative z-10">Send Money Now →</span>
              </button>
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium link-lift"
              style={{ color: "rgba(201,168,76,0.7)" }}
            >
              See how it works ↓
            </Link>
          </motion.div>
        </div>

        {/* Exchange Calculator — floating bottom-right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-16 lg:mt-0 lg:absolute lg:right-6 lg:bottom-16 lg:w-[400px]"
        >
          <ExchangeCalculator />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PHILOSOPHY SECTION
───────────────────────────────────────────────────────────── */

function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="philosophy"
      className="relative py-32 px-4 overflow-hidden"
      style={{ backgroundColor: "#1A1A22" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=1400&q=60')",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto text-center px-4">
        <SectionLabel text="Manifesto" />

        {/* Neutral statement */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-sm md:text-base mb-6"
          style={{ color: "rgba(250,248,245,0.4)" }}
        >
          Most remittance services focus on: slow bank rails, hidden margins, and opaque fees.
        </motion.p>

        {/* Power statement */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="font-heading font-bold tracking-tight leading-[1.1]"
          style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)", color: "#FAF8F5" }}
        >
          We focus on:{" "}
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              color: "#C9A84C",
            }}
          >
            radical transparency.
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="mt-8 text-sm md:text-base max-w-2xl mx-auto"
          style={{ color: "rgba(250,248,245,0.4)" }}
        >
          Every transaction verifiable. Every rate published on-chain. Every peso accounted for.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRICING SECTION
───────────────────────────────────────────────────────────── */

function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section id="pricing">
      <SectionLabel text="Pricing" />
      <h2
        className="font-heading font-bold tracking-tight mb-14"
        style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#FAF8F5" }}
      >
        Transparent fees.{" "}
        <span
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: "italic",
            color: "#C9A84C",
          }}
        >
          No surprises.
        </span>
      </h2>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pricingTiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative flex flex-col p-8 rounded-4xl border noise-overlay ${
              tier.accent ? "ring-1" : ""
            }`}
            style={{
              backgroundColor: tier.accent
                ? "rgba(201,168,76,0.1)"
                : "rgba(42,42,53,0.45)",
              borderColor: tier.accent
                ? "rgba(201,168,76,0.5)"
                : "rgba(255,255,255,0.07)",
              boxShadow: tier.accent
                ? "0 0 40px rgba(201,168,76,0.12)"
                : undefined,
            }}
          >
            {tier.accent && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: "#C9A84C",
                  color: "#0D0D12",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-heading text-lg font-semibold text-brand-ivory mb-1">
                {tier.name}
              </h3>
              <p className="text-xs text-brand-ivory/40 leading-relaxed">{tier.desc}</p>
            </div>

            <div className="mb-8">
              <span
                className="text-4xl font-bold tracking-tight"
                style={{ color: tier.accent ? "#C9A84C" : "#FAF8F5" }}
              >
                {tier.fee}
              </span>
              <span className="text-xs text-brand-ivory/30 ml-2">/ transaction</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-brand-ivory/60">
                  <Check
                    size={14}
                    className="mt-0.5 shrink-0"
                    style={{ color: "#C9A84C" }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <Link href={tier.name === "Enterprise" ? "#" : "/send"}>
              <button
                className={`w-full rounded-3xl py-3 text-sm font-semibold transition-all duration-300 ${
                  tier.accent ? "btn-neon overflow-hidden" : ""
                }`}
                style={
                  !tier.accent
                    ? {
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(250,248,245,0.7)",
                      }
                    : {}
                }
              >
                {tier.accent ? (
                  <>
                    <span className="btn-slide" />
                    <span className="relative z-10">{tier.cta}</span>
                  </>
                ) : (
                  tier.cta
                )}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#0D0D12" }}>

      {/* A. HERO */}
      <HeroSection />

      {/* Faucet widget */}
      <Section>
        <MintFaucet />
      </Section>

      {/* B. FEATURES */}
      <Section id="features" className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" } as React.CSSProperties}>
        <SectionLabel text="Features" />
        <h2
          className="font-heading font-bold tracking-tight mb-12"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#FAF8F5" }}
        >
          Why choose{" "}
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              color: "#C9A84C",
            }}
          >
            RemicoPay?
          </span>
        </h2>
        <FeaturesSection />
      </Section>

      {/* C. PHILOSOPHY */}
      <PhilosophySection />

      {/* D. PROTOCOL */}
      <Section id="protocol" className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" } as React.CSSProperties}>
        <SectionLabel text="Protocol" />
        <h2
          className="font-heading font-bold tracking-tight mb-12"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#FAF8F5" }}
        >
          How it{" "}
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              color: "#C9A84C",
            }}
          >
            works.
          </span>
        </h2>
        <ProtocolSection />
      </Section>

      {/* E. PRICING */}
      <PhilosophySpacer />
      <PricingSection />

      {/* F. TEAM */}
      <Section
        id="team"
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)" } as React.CSSProperties}
      >
        <SectionLabel text="Team" />
        <h2
          className="font-heading font-bold tracking-tight mb-12"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#FAF8F5" }}
        >
          The people behind{" "}
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              color: "#C9A84C",
            }}
          >
            the protocol.
          </span>
        </h2>
        <AnimatedTestimonials testimonials={teamMembers} />
      </Section>
    </div>
  );
}

/* Thin divider between philosophy and pricing */
function PhilosophySpacer() {
  return (
    <div
      className="h-px w-full max-w-6xl mx-auto"
      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    />
  );
}
