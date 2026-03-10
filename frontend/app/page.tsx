"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import ExchangeCalculator from "@/components/home/ExchangeCalculator";
import MintFaucet from "@/components/home/MintFaucet";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProtocolSection from "@/components/home/ProtocolSection";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Check, Users, ArrowRightLeft, Coins } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const teamMembers = [
  {
    quote:
      "Major in FinTech and Digital Innovation, Year 4 BAScT HKBU. #FinTech Intern at FORMS HK Built AI platform for 2,000+ employees. #Compliance intern at Kena Finance Prepared AML, Licensing and PDPO documentation.",
    name: "Ahtasham Ahmed",
    designation: "Founder, CEO",
    src: "https://cdn.gamma.app/mio4b0bgfmpw1ee/3dad9ab1f59640b2943ce72d65f43c88/optimized/WhatsApp-Tu-Xiang2025-10-05-Yu16.52.24_57310e24.avif",
  },
  {
    quote:
      "Major in FinTech and Digital Innovation, Year 4 BAScT HKBU. #Marketing & Operation Intern at Kena Finance. #Led user acquisition and testing in Philippines and Indonesia markets. #Built frontend, and resolved production bugs from user feedback.",
    name: "Chen Boyu, Dave",
    designation: "Founder, CTO",
    src: "https://cdn.gamma.app/mio4b0bgfmpw1ee/722fee062f0944d8bb00a4c11715e230/optimized/WhatsApp-Tu-Xiang2025-10-05-Yu16.59.17_cd6c82f7.avif",
  },
  {
    quote:
      "Health Technology and Social Change, Year 2 BAScT HKBU. #Major Skills: Smart contract development & AI feature optimization. #Built WeBond - An AI-powered platform connecting local and non-local communities. Hands-on experience engaging with migrant worker communities.",
    name: "Leung Man To, Thomas",
    designation: "R&D",
    src: "/thomas.jpg",
  },
];

const ultimateGoals = [
  {
    title: "Target Users",
    subtitle: "Phase 1 - HK → PHP / IDR corridors",
    desc: "Designed for domestic workers and migrant workers in Hong Kong sending money home.",
    features: [
      "Simple mobile-first interface",
      "Optimized for small and medium transfers"
    ]
  },
  {
    title: "Easy Transfer",
    subtitle: "Light KYC onboarding",
    desc: "Send money using tools you already use.",
    features: [
      "Support Faster Payment System (FPS)",
      "Fund transfers from any FPS-enabled bank or e-wallet",
      "No crypto knowledge required",
      "Simple HKD deposit to overseas payout"
    ]
  },
  {
    title: "Stablecoin Settlement",
    subtitle: "Below 1% / transaction",
    desc: "Faster and cheaper global transfers.",
    features: [
      "Near-instant settlement on blockchain",
      "Transparent on-chain verification"
    ]
  }
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
              Stablecoin.
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
            Send HKD to PHP in minutes — not days. Best exchange rates,
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
          Most remittance services are slow, hidden margins, and large fees.
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

function UltimateGoalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const getIcon = (title: string) => {
    if (title === "Target Users") return <Users className="w-6 h-6" />;
    if (title === "Easy Transfer") return <ArrowRightLeft className="w-6 h-6" />;
    return <Coins className="w-6 h-6" />;
  };

  return (
    <Section id="ultimate-goal">
      <SectionLabel text="Ultimate Goal" />
      <h2
        className="font-heading font-bold tracking-tight mb-14 max-w-4xl"
        style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#FAF8F5" }}
      >
        Built for real-world remittance{" "}
        <span
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: "italic",
            color: "#C9A84C",
          }}
        >
          between Hong Kong and Southeast Asia.
        </span>
      </h2>

      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {ultimateGoals.map((goal, i) => (
          <motion.div
            key={goal.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative flex flex-col p-8 md:p-10 rounded-4xl border overflow-hidden bg-[#2A2A35]/30 hover:bg-[#2A2A35]/40 transition-colors duration-500"
            style={{
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Top Section */}
            <div className="relative z-10 flex flex-col gap-6 mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] group-hover:scale-110 group-hover:bg-[#C9A84C]/20 transition-all duration-500 shadow-[0_0_15px_rgba(201,168,76,0.1)] group-hover:shadow-[0_0_25px_rgba(201,168,76,0.2)]">
                {getIcon(goal.title)}
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold tracking-tight mb-3 text-[#FAF8F5]">
                  {goal.title}
                </h3>
                <p className="text-sm md:text-base text-brand-ivory/50 leading-relaxed min-h-[48px]">
                  {goal.desc}
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            {/* Bottom Section */}
            <div className="relative z-10 flex flex-col flex-1">
              <div
                className="inline-flex items-center gap-2 mb-8 font-semibold w-full"
                style={{ color: "#C9A84C" }}
              >
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-4 py-2 rounded-xl text-lg w-full text-center group-hover:shadow-[0_0_15px_rgba(201,168,76,0.1)] transition-shadow">
                  {goal.subtitle}
                </div>
              </div>

              <ul className="flex flex-col gap-5 mt-auto">
                {goal.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-4 text-sm md:text-base text-brand-ivory/70 transition-colors group-hover:text-brand-ivory/90">
                    <Check
                      size={20}
                      className="mt-0.5 shrink-0"
                      style={{ color: "rgba(201,168,76,0.8)" }}
                    />
                    <span className="leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Glowing border effect on hover */}
            <div className="absolute inset-0 rounded-4xl border border-[#C9A84C] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_20px_rgba(201,168,76,0.1)]" />
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
        <SectionLabel text="MVP Testing" />
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

      {/* E. ULTIMATE GOALS */}
      <PhilosophySpacer />
      <UltimateGoalSection />

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
          The people{" "}
          <span
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: "italic",
              color: "#C9A84C",
            }}
          >
            behind.
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
