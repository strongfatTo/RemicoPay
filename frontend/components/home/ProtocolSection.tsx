"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Connect & Fund",
    desc: "Link your Web3 wallet and claim test HKDR stablecoins via the on-chain faucet. No bank account needed.",
    visual: "helix",
  },
  {
    num: "02",
    title: "Send in Seconds",
    desc: "Enter the recipient's wallet address and HKD amount. Smart contracts handle conversion, fee deduction, and settlement automatically.",
    visual: "scanner",
  },
  {
    num: "03",
    title: "Verify On-Chain",
    desc: "Track every remittance by ID. Full transparency — from creation to completion — permanently recorded on Etherlink.",
    visual: "waveform",
  },
];

/* ── Wallet Connect Visual ── */
function WalletVisual() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Wallet body */}
      <motion.div
        className="relative z-10 w-12 h-9 border border-[#C9A84C]/50 rounded-lg bg-[#2A2A35]/80 backdrop-blur-sm shadow-[0_0_15px_rgba(201,168,76,0.15)] flex items-center"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Wallet flap / clip */}
        <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-3 bg-[#C9A84C] rounded-r-sm" />

        {/* Connection pulse from wallet */}
        <motion.div
          className="absolute inset-0 border border-[#C9A84C] rounded-lg"
          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>

      {/* Coins dropping in */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute z-0 w-4 h-4 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#C9A84C]/50 flex items-center justify-center p-[1px]"
          initial={{ y: -25, opacity: 0, scale: 0.5 }}
          animate={{ y: [-25, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 1.25 }}
        >
          <div className="w-full h-full rounded-full bg-[#0D0D12] flex items-center justify-center">
            <span className="text-[8px] text-[#C9A84C] font-bold font-mono hover:cursor-default">$</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Smart Contract Convert Visual ── */
function ConvertVisual() {
  return (
    <div className="relative w-40 h-24 flex items-center justify-between px-2">
      {/* HKD Node */}
      <div className="flex flex-col items-center z-10 bg-[#0D0D12] p-1 rounded-full">
        <div className="w-9 h-9 rounded-full border border-white/10 bg-[#2A2A35]/50 flex items-center justify-center text-[10px] text-brand-ivory/60 font-mono shadow-inner">
          HKD
        </div>
      </div>

      {/* Center Smart Contract Node */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rotate-45 border-[1.5px] border-[#C9A84C]/80 bg-[#C9A84C]/10 flex items-center justify-center z-20 backdrop-blur-md shadow-[0_0_15px_rgba(201,168,76,0.3)]"
        animate={{ rotate: [45, 225] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <motion.div className="w-3 h-3 border border-[#C9A84C] border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
      </motion.div>

      {/* Path lines */}
      <div className="absolute left-[34px] right-[34px] h-[1px] bg-gradient-to-r from-white/10 via-[#C9A84C]/50 to-white/10 z-0">
        {/* Particles */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_8px_#C9A84C]"
          animate={{ left: ["0%", "45%", "55%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* PHP Node */}
      <div className="flex flex-col items-center z-10 bg-[#0D0D12] p-1 rounded-full">
        <div className="w-9 h-9 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 flex items-center justify-center text-[10px] text-[#C9A84C] font-bold font-mono shadow-[0_0_10px_rgba(201,168,76,0.15)]">
          PHP
        </div>
      </div>
    </div>
  );
}

/* ── Blockchain Verify Visual ── */
function BlockchainVisual() {
  return (
    <div className="relative w-36 h-24 flex items-center justify-center">
      {/* Blockchain Network */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && (
              <div className="w-4 h-[2px] rounded-full bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-[#C9A84C] shadow-[0_0_5px_#C9A84C]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            )}
            <motion.div
              className="w-7 h-7 border-[1.5px] border-[#C9A84C]/30 bg-[#2A2A35]/80 rounded flex items-center justify-center relative backdrop-blur-sm"
              animate={{
                borderColor: i === 2 ? ["rgba(201,168,76,0.3)", "rgba(201,168,76,1)", "rgba(201,168,76,0.3)"] : "rgba(201,168,76,0.3)",
                boxShadow: i === 2 ? ["0 0 0px rgba(201,168,76,0)", "0 0 15px rgba(201,168,76,0.4)", "0 0 0px rgba(201,168,76,0)"] : "none",
                y: [0, -2, 0]
              }}
              transition={{
                borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
              }}
            >
              {/* Last block gets a checkmark or lock to signify recorded / verified */}
              {i === 2 ? (
                <motion.svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              )}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Etherlink Label / Tag */}
      <motion.div
        className="absolute -bottom-1 right-2 px-1.5 py-0.5 rounded text-[7px] border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] font-mono tracking-wider opacity-80"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ETHERLINK
      </motion.div>
    </div>
  );
}

const visuals = {
  helix: <WalletVisual />,
  scanner: <ConvertVisual />,
  waveform: <BlockchainVisual />,
};

/* ── Protocol Card ── */
function ProtocolCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="glass-card noise-overlay p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8"
    >
      {/* Step number */}
      <span
        className="shrink-0 text-5xl font-bold leading-none"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(201,168,76,0.25)",
        }}
      >
        {step.num}
      </span>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-heading text-xl font-semibold tracking-tight text-brand-ivory mb-2">
          {step.title}
        </h3>
        <p className="text-sm text-brand-ivory/50 leading-relaxed max-w-xl">
          {step.desc}
        </p>
      </div>

      {/* Visual */}
      <div className="shrink-0 opacity-80">
        {visuals[step.visual as keyof typeof visuals]}
      </div>
    </motion.div>
  );
}

export default function ProtocolSection() {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <ProtocolCard key={step.num} step={step} index={i} />
      ))}
      <div className="pt-6 text-center">
        <p className="text-xs text-brand-ivory/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          *Detail steps please refers to Github
        </p>
      </div>
    </div>
  );
}
