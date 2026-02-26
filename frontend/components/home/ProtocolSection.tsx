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
    desc: "Enter the recipient address and HKD amount. Smart contracts handle conversion, fee deduction, and settlement automatically.",
    visual: "scanner",
  },
  {
    num: "03",
    title: "Verify On-Chain",
    desc: "Track every remittance by ID. Full transparency — from creation to completion — permanently recorded on Etherlink.",
    visual: "waveform",
  },
];

/* ── Helix SVG animation ── */
function HelixVisual() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.ellipse
          key={i}
          cx={20 + i * 20}
          cy={40}
          rx={8}
          ry={16}
          stroke="#C9A84C"
          strokeWidth="1.2"
          fill="none"
          strokeOpacity={0.6 - i * 0.08}
          animate={{ ry: [16, 8, 16], strokeOpacity: [0.6, 0.3, 0.6] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

/* ── Scanner grid visual ── */
function ScannerVisual() {
  return (
    <div className="relative w-32 h-20 overflow-hidden rounded-xl">
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(201,168,76,0.35) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      {/* Scanning line */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 rounded-full"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #C9A84C, transparent)",
          boxShadow: "0 0 8px rgba(201,168,76,0.8)",
        }}
        animate={{ x: [-8, 136] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ── EKG waveform visual ── */
function WaveformVisual() {
  const path =
    "M0,40 L20,40 L25,20 L30,60 L35,10 L40,65 L45,40 L60,40 L65,30 L70,50 L75,40 L120,40";

  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      <motion.path
        d={path}
        stroke="#C9A84C"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
        animate={{ strokeDashoffset: [0, -200] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        cx="35"
        cy="10"
        r="3"
        fill="#C9A84C"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

const visuals = {
  helix: <HelixVisual />,
  scanner: <ScannerVisual />,
  waveform: <WaveformVisual />,
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
    </div>
  );
}
