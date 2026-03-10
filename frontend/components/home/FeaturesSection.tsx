"use client";

import { motion } from "framer-motion";

/* ─── Shared card wrapper ────────────────────────────────── */
function FeatureCard({
  heading,
  descriptor,
  children,
}: {
  heading: string;
  descriptor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card noise-overlay p-6 flex flex-col gap-6 min-h-[340px]">
      <div>
        <h3 className="font-heading text-base font-semibold tracking-tight text-brand-ivory mb-1">
          {heading}
        </h3>
        <p className="text-xs text-brand-ivory/40 leading-relaxed">{descriptor}</p>
      </div>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ─── Card 1: Rate Comparison ───────────────────────── */
function RateComparison() {
  return (
    <div className="flex flex-col w-full gap-4 font-mono text-sm mt-4">
      {/* Standard Bank */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#2A2A35]/30">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-brand-ivory/40 tracking-wider uppercase">Bank Rate</span>
          <span className="text-brand-ivory/60 font-medium text-sm">1 HKD = 6.90 PHP</span>
        </div>
        <div className="text-right flex flex-col gap-1.5">
          <span className="text-[10px] text-brand-ivory/40 tracking-wider uppercase">Fee</span>
          <span className="text-brand-ivory/60 font-medium text-sm">~ $15.00</span>
        </div>
      </div>

      {/* RemicoPay */}
      <motion.div
        className="flex items-center justify-between p-4 rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/10 relative overflow-hidden shadow-[0_0_15px_rgba(201,168,76,0.1)]"
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent w-[200%]"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="flex flex-col gap-1.5 relative z-10">
          <span className="text-[10px] text-[#C9A84C]/80 tracking-wider uppercase flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            RemicoPay
          </span>
          <span className="text-[#C9A84C] font-bold text-lg">1 HKD = 7.35 PHP</span>
        </div>
        <div className="text-right flex flex-col gap-1.5 relative z-10">
          <span className="text-[10px] text-[#C9A84C]/80 tracking-wider uppercase font-bold">Fee</span>
          <span className="text-[#C9A84C] font-bold text-lg">&lt; 1%</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Card 2: Speed Comparison ──────────────────────── */
function SpeedComparison() {
  return (
    <div className="w-full flex flex-col gap-8 justify-center h-full font-mono text-sm py-2">
      {/* Bank Progress */}
      <div className="space-y-3">
        <div className="flex justify-between text-[11px] text-brand-ivory/50 tracking-wider">
          <span className="uppercase">Traditional Bank</span>
          <span>3-5 Business Days</span>
        </div>
        <div className="h-1.5 w-full bg-[#2A2A35]/50 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-brand-ivory/20"
            animate={{ width: ["0%", "30%"] }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ width: "30%" }}
          />
        </div>
      </div>

      {/* RemicoPay Progress */}
      <div className="space-y-3">
        <div className="flex justify-between text-[11px] text-[#C9A84C] tracking-wider font-bold">
          <span className="uppercase flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            RemicoPay
          </span>
          <span>~1.2 seconds</span>
        </div>
        <div className="h-1.5 w-full bg-[#2A2A35]/50 rounded-full overflow-hidden border border-[#C9A84C]/10">
          <motion.div
            className="h-full bg-[#C9A84C] shadow-[0_0_8px_#C9A84C]"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Card 3: Shield And License ─────────────────── */
function ShieldAndLicense() {
  return (
    <div className="relative w-full h-44 flex items-center justify-center font-mono font-medium">
      {/* Hexagon/Shield Base */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex items-center justify-center w-20 h-24 rounded-2xl bg-gradient-to-b from-[#C9A84C]/20 to-[#C9A84C]/5 border border-[#C9A84C]/40 backdrop-blur-sm shadow-[0_0_25px_rgba(201,168,76,0.15)]"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </motion.div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ stroke: "#C9A84C", strokeWidth: 1, strokeDasharray: "4 4" }}>
        <line x1="20%" y1="30%" x2="50%" y2="50%" />
        <line x1="80%" y1="70%" x2="50%" y2="50%" />
        <line x1="80%" y1="30%" x2="50%" y2="50%" />
      </svg>

      {/* Badges */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-4 left-0 lg:-left-4 bg-[#2A2A35]/90 border border-white/10 px-3 py-2 rounded-lg text-[10px] text-brand-ivory/80 backdrop-blur-md flex items-center gap-2 shadow-xl"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        HKMA Licensed
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-6 right-0 lg:-right-4 bg-[#C9A84C]/10 border border-[#C9A84C]/40 px-3 py-2 rounded-lg text-[10px] text-[#C9A84C] backdrop-blur-md flex items-center gap-2 shadow-xl shadow-[#C9A84C]/10"
      >
        <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse shadow-[0_0_5px_#C9A84C]" />
        On-Chain Verification
      </motion.div>

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-8 right-0 lg:-right-4 bg-[#2A2A35]/90 border border-white/10 px-3 py-2 rounded-lg text-[10px] text-brand-ivory/80 backdrop-blur-md flex items-center gap-2 shadow-xl hidden sm:flex"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        Audited Contract
      </motion.div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────── */
export default function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <FeatureCard
        heading="Best Exchange Rates"
        descriptor="RemicoPay consistently outperforms traditional banks by up to 5% on HKD→PHP. Below 1% fee per transaction fee."
      >
        <RateComparison />
      </FeatureCard>

      <FeatureCard
        heading="Instant Confirmation"
        descriptor="Transactions settle on Etherlink in under minutes — not several business days. Support emergency."
      >
        <SpeedComparison />
      </FeatureCard>

      <FeatureCard
        heading="Licensed & Secure"
        descriptor="Every remittance verified on-chain and using HKMA-licensed stablecoin"
      >
        <div className="relative w-full">
          <ShieldAndLicense />
        </div>
      </FeatureCard>
    </div>
  );
}
