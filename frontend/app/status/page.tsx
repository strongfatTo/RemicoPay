"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Search,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatTokenAmount, shortenAddress, formatTimestamp } from "@/lib/utils";
import { useRemittance } from "@/lib/hooks";
import { RATE_SCALE } from "@/lib/contracts";

const statusSteps = [
  { label: "Created", description: "Remittance submitted on-chain", icon: Package },
  { label: "Processing", description: "HKDR locked, awaiting settlement", icon: Loader2 },
  { label: "Completed", description: "PHPC delivered to recipient", icon: CheckCircle2 },
];

const STATUS_MAP: Record<number, string> = {
  0: "Pending",
  1: "Completed",
  2: "Refunded",
};

function getActiveStep(status: number): number {
  if (status === 1) return 3; // Completed → all 3 steps done
  if (status === 2) return -1; // Refunded
  return 1; // Pending → step 1 done, step 2 in progress
}

export default function StatusPage() {
  const [remitIdInput, setRemitIdInput] = useState("");
  const [searchId, setSearchId] = useState<bigint>(0n);
  const [hasSearched, setHasSearched] = useState(false);
  const [confettiFired, setConfettiFired] = useState(false);

  const { data: remittance, isLoading, error } = useRemittance(searchId);

  const handleSearch = () => {
    const id = parseInt(remitIdInput);
    if (!isNaN(id) && id > 0) {
      setSearchId(BigInt(id));
      setHasSearched(true);
      setConfettiFired(false);
    }
  };

  // Fire confetti when remittance is completed
  useEffect(() => {
    if (remittance && !confettiFired) {
      const data = remittance as any;
      const status = Number(data.status ?? data[7] ?? 0);
      if (status === 1) {
        setConfettiFired(true);
        const end = Date.now() + 1500;
        const frame = () => {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#2dd4bf", "#14b8a6", "#5eead4"],
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#2dd4bf", "#14b8a6", "#5eead4"],
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      }
    }
  }, [remittance, confettiFired]);

  // Parse remittance data
  const remitData = remittance
    ? (() => {
        const d = remittance as any;
        return {
          sender: (d.sender ?? d[0]) as string,
          recipient: (d.recipient ?? d[1]) as string,
          hkdAmount: BigInt(d.hkdAmount ?? d[2] ?? 0),
          phpAmount: BigInt(d.phpAmount ?? d[3] ?? 0),
          fee: BigInt(d.fee ?? d[4] ?? 0),
          lockedRate: BigInt(d.lockedRate ?? d[5] ?? 0),
          createdAt: Number(d.createdAt ?? d[6] ?? 0),
          status: Number(d.status ?? d[7] ?? 0),
        };
      })()
    : null;

  const activeStep = remitData ? getActiveStep(remitData.status) : 0;
  const isRefunded = remitData?.status === 2;

  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep via-brand-deep/95 to-brand-navy/50 z-0" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 pt-20 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
            Transaction Status
          </h1>
          <p className="text-white/50">Track your remittance on Etherlink</p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <label className="text-sm text-white/60 mb-2 block">
            Remittance ID
          </label>
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Enter remittance ID (e.g. 1)"
              value={remitIdInput}
              onChange={(e) => setRemitIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button
              variant="neon"
              onClick={handleSearch}
              disabled={!remitIdInput || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <Loader2 className="h-8 w-8 animate-spin text-brand-mint mx-auto mb-4" />
            <p className="text-white/50">Fetching on-chain data...</p>
          </motion.div>
        )}

        {/* Error / Not Found */}
        {hasSearched && !isLoading && (error || (!remitData || remitData.sender === "0x0000000000000000000000000000000000000000")) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <XCircle className="h-12 w-12 text-red-400/60 mx-auto mb-4" />
            <p className="text-white font-semibold mb-1">Remittance Not Found</p>
            <p className="text-white/40 text-sm">
              No remittance found with ID #{remitIdInput}. Make sure the ID is
              correct and the contract is deployed.
            </p>
          </motion.div>
        )}

        {/* Result */}
        {remitData && remitData.sender !== "0x0000000000000000000000000000000000000000" && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Progress Steps */}
            <div className="glass-card p-8">
              <h3 className="font-heading text-lg font-semibold text-white mb-6">
                {isRefunded ? "Remittance Refunded" : "Transfer Progress"}
              </h3>

              {isRefunded ? (
                <div className="text-center py-6">
                  <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 font-semibold text-lg">Refunded</p>
                  <p className="text-white/40 text-sm mt-1">
                    This remittance has been refunded to the sender.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
                  <motion.div
                    className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-brand-mint to-brand-mint/50"
                    initial={{ height: 0 }}
                    animate={{
                      height:
                        activeStep >= 3
                          ? "100%"
                          : activeStep === 1
                          ? "33%"
                          : "0%",
                    }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  />

                  <div className="space-y-8">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index < activeStep;
                      const isCurrent =
                        index ===
                        (activeStep >= 3 ? 2 : activeStep === 1 ? 1 : 0);

                      return (
                        <div key={step.label} className="flex items-start gap-4">
                          {/* Node */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.15 }}
                            className={cn(
                              "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500",
                              isActive
                                ? "border-brand-mint bg-brand-mint/15 shadow-neon-mint"
                                : isCurrent
                                ? "border-brand-mint/60 bg-brand-mint/10 animate-pulse"
                                : "border-white/10 bg-brand-deep"
                            )}
                          >
                            {isActive ? (
                              <CheckCircle2 className="h-5 w-5 text-brand-mint" />
                            ) : isCurrent ? (
                              <Loader2 className="h-5 w-5 text-brand-mint animate-spin" />
                            ) : (
                              <Icon className="h-5 w-5 text-white/30" />
                            )}

                            {/* Neon ripple on active/current */}
                            {(isActive || isCurrent) && (
                              <motion.div
                                className="absolute inset-0 rounded-full border border-brand-mint/40"
                                animate={{
                                  scale: [1, 1.6],
                                  opacity: [0.6, 0],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeOut",
                                }}
                              />
                            )}
                          </motion.div>

                          {/* Label */}
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.15 }}
                            className="pt-1"
                          >
                            <p
                              className={cn(
                                "font-medium",
                                isActive || isCurrent
                                  ? "text-white"
                                  : "text-white/40"
                              )}
                            >
                              {step.label}
                            </p>
                            <p className="text-sm text-white/40">
                              {step.description}
                            </p>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Details Card */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-heading text-sm font-semibold text-white/70 uppercase tracking-wider">
                Transaction Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Remittance ID</span>
                  <span className="text-white font-mono">
                    #{searchId.toString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Status</span>
                  <span
                    className={cn(
                      "font-semibold",
                      remitData.status === 1
                        ? "text-green-400"
                        : remitData.status === 2
                        ? "text-red-400"
                        : "text-yellow-400"
                    )}
                  >
                    {STATUS_MAP[remitData.status] ?? "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Sender</span>
                  <span className="text-white font-mono text-xs">
                    {shortenAddress(remitData.sender, 6)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Recipient</span>
                  <span className="text-white font-mono text-xs">
                    {shortenAddress(remitData.recipient, 6)}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                  <span className="text-white/50">Sent</span>
                  <span className="text-white font-semibold">
                    {formatTokenAmount(remitData.hkdAmount)} HKDR
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Fee</span>
                  <span className="text-white/70">
                    {formatTokenAmount(remitData.fee)} HKDR
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Recipient Gets</span>
                  <span className="text-brand-mint font-bold text-lg">
                    ₱ {formatTokenAmount(remitData.phpAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Exchange Rate</span>
                  <span className="text-white/70">
                    1 HKD ={" "}
                    {(
                      Number(remitData.lockedRate) / Number(RATE_SCALE)
                    ).toFixed(2)}{" "}
                    PHP
                  </span>
                </div>
                {remitData.createdAt > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Created</span>
                    <span className="text-white/70">
                      {formatTimestamp(remitData.createdAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Back to Send */}
            <div className="text-center">
              <a href="/send">
                <Button variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Send Another Remittance
                </Button>
              </a>
            </div>
          </motion.div>
        )}

        {/* Placeholder when no search yet */}
        {!hasSearched && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-12 text-center"
          >
            <Clock className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 mb-2">Enter a Remittance ID to track</p>
            <p className="text-white/25 text-sm">
              You can find your remittance ID from the send confirmation page
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
