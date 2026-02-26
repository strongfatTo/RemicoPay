"use client";

import { useState, useEffect, useRef } from "react";
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

/* ─── Card 1: Diagnostic Shuffler ───────────────────────── */
const rateLabels = [
  { label: "HKD → PHP", rate: "7.35x" },
  { label: "Market avg", rate: "6.90x" },
  { label: "Bank wire",  rate: "6.50x" },
];

function DiagnosticShuffler() {
  const [cards, setCards] = useState(rateLabels);

  useEffect(() => {
    const id = setInterval(() => {
      setCards((prev) => {
        const next = [...prev];
        const last = next.pop()!;
        next.unshift(last);
        return next;
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-44 flex items-end justify-center">
      {cards.map((item, i) => {
        const zIndex = cards.length - i;
        const yOffset = i * 14;
        const scale = 1 - i * 0.05;
        return (
          <motion.div
            key={item.label}
            layout
            animate={{ y: yOffset, scale, zIndex, opacity: 1 - i * 0.2 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              layout: { type: "spring", stiffness: 260, damping: 20 },
            }}
            className="absolute bottom-0 w-full rounded-3xl border px-5 py-4 flex items-center justify-between"
            style={{
              backgroundColor: i === 0 ? "rgba(201,168,76,0.12)" : "rgba(42,42,53,0.6)",
              borderColor: i === 0 ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)",
            }}
          >
            <span
              className="text-sm font-medium"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: i === 0 ? "#C9A84C" : "rgba(250,248,245,0.5)",
              }}
            >
              {item.label}
            </span>
            <span
              className="text-lg font-bold"
              style={{ color: i === 0 ? "#C9A84C" : "rgba(250,248,245,0.35)" }}
            >
              {item.rate}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Card 2: Telemetry Typewriter ──────────────────────── */
const feedMessages = [
  "TX 0x4f2a… confirmed in 1.2s",
  "Block #8,441,902 sealed",
  "HKDR → PHPC bridge: success",
  "Settlement finalized on-chain",
  "Gas: 0.00012 XTZ",
  "Recipient credited ✓",
];

function TelemetryTypewriter() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const msg = feedMessages[msgIndex];
    if (charIdx < msg.length) {
      const t = setTimeout(() => {
        setDisplayed(msg.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setMsgIndex((m) => (m + 1) % feedMessages.length);
        setDisplayed("");
        setCharIdx(0);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [charIdx, msgIndex]);

  return (
    <div
      className="w-full rounded-3xl border p-5"
      style={{
        backgroundColor: "rgba(13,13,18,0.7)",
        borderColor: "rgba(201,168,76,0.15)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className="h-2 w-2 rounded-full animate-pulse"
          style={{ backgroundColor: "#C9A84C", boxShadow: "0 0 6px rgba(201,168,76,0.8)" }}
        />
        <span className="text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
          Live Feed
        </span>
      </div>
      <div className="space-y-2 text-xs text-brand-ivory/30">
        {feedMessages.slice(0, 3).map((m, i) => (
          <div key={i} className="opacity-40 truncate">
            {m}
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-white/[0.06] pt-3">
        <span className="text-sm text-brand-ivory/90">
          {displayed}
          <span
            className="inline-block w-0.5 h-4 ml-0.5 align-middle"
            style={{
              backgroundColor: "#C9A84C",
              animation: "typewriter-cursor 1s step-end infinite",
            }}
          />
        </span>
      </div>
    </div>
  );
}

/* ─── Card 3: Cursor Protocol Scheduler ─────────────────── */
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function CursorScheduler() {
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [phase, setPhase] = useState<"idle" | "move" | "click" | "save">("idle");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    const run = () => {
      setPhase("idle");
      setActiveDay(null);
      setSaved(false);
      t = setTimeout(() => {
        setPhase("move");
        t = setTimeout(() => {
          setPhase("click");
          setActiveDay(3); // Wednesday
          t = setTimeout(() => {
            setPhase("save");
            setSaved(true);
            t = setTimeout(run, 2200);
          }, 700);
        }, 900);
      }, 600);
    };
    run();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Weekly grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((d, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor:
                activeDay === i
                  ? "rgba(201,168,76,0.25)"
                  : "rgba(42,42,53,0.5)",
              borderColor:
                activeDay === i
                  ? "rgba(201,168,76,0.6)"
                  : "rgba(255,255,255,0.07)",
              scale: phase === "click" && activeDay === i ? 0.92 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border aspect-square flex items-center justify-center text-xs font-medium"
            style={{
              color: activeDay === i ? "#C9A84C" : "rgba(250,248,245,0.35)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {d}
          </motion.div>
        ))}
      </div>

      {/* Save button */}
      <motion.div
        animate={{
          backgroundColor: saved
            ? "rgba(201,168,76,0.2)"
            : "rgba(42,42,53,0.4)",
          borderColor: saved
            ? "rgba(201,168,76,0.5)"
            : "rgba(255,255,255,0.07)",
        }}
        className="w-full rounded-2xl border px-4 py-2.5 text-center text-xs font-semibold transition-all"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: saved ? "#C9A84C" : "rgba(250,248,245,0.3)",
        }}
      >
        {saved ? "✓ Compliance Saved" : "Save Schedule"}
      </motion.div>

      {/* Animated SVG cursor */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          x: phase === "idle" ? 20 : phase === "move" ? 90 : phase === "click" ? 90 : 160,
          y: phase === "save" ? 60 : 20,
          opacity: phase === "idle" ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
          <path
            d="M1 1l7 18 3.5-7L19 8.5 1 1z"
            fill="#C9A84C"
            stroke="#0D0D12"
            strokeWidth="1.5"
          />
        </svg>
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
        descriptor="RemicoPay consistently outperforms traditional banks by up to 12% on HKD→PHP."
      >
        <DiagnosticShuffler />
      </FeatureCard>

      <FeatureCard
        heading="Instant Confirmation"
        descriptor="Transactions settle on Etherlink in under 2 seconds — not 2 business days."
      >
        <TelemetryTypewriter />
      </FeatureCard>

      <FeatureCard
        heading="Licensed & Secure"
        descriptor="AML-compliant, PDPO-ready infrastructure. Every remittance verified on-chain."
      >
        <div className="relative w-full">
          <CursorScheduler />
        </div>
      </FeatureCard>
    </div>
  );
}
