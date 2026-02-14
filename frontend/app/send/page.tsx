"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, Check, Wallet, FileCheck, Send, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import {
  useApproveHKDR,
  useCreateRemittance,
  useHKDRBalance,
  useExchangeRate,
  useFeeBps,
  formatEther,
} from "@/lib/hooks";
import { RATE_SCALE } from "@/lib/contracts";

const steps = [
  { id: 0, label: "Details", icon: FileCheck },
  { id: 1, label: "Approve", icon: Wallet },
  { id: 2, label: "Send", icon: Send },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

export default function SendPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({ recipient: "", amount: "" });
  const [txSuccess, setTxSuccess] = useState(false);

  const { isConnected } = useAccount();
  const { data: balance } = useHKDRBalance();
  const { data: onChainRate } = useExchangeRate();
  const { data: onChainFee } = useFeeBps();

  const {
    approve, hash: approveHash, isPending: approvePending,
    isConfirming: approveConfirming, isSuccess: approveSuccess, error: approveError,
  } = useApproveHKDR();

  const {
    send: createRemittance, hash: remitHash, isPending: remitPending,
    isConfirming: remitConfirming, isSuccess: remitSuccess, error: remitError,
  } = useCreateRemittance();

  const exchangeRate = onChainRate ? Number(onChainRate as bigint) / Number(RATE_SCALE) : 7.35;
  const feeRate = onChainFee ? Number(onChainFee as bigint) / 10000 : 0.007;
  const numericAmount = parseFloat(formData.amount) || 0;
  const fee = numericAmount * feeRate;
  const phpAmount = (numericAmount - fee) * exchangeRate;
  const formattedBalance = balance
    ? Number(formatEther(balance as bigint)).toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "0";

  useEffect(() => {
    if (approveSuccess && currentStep === 1) {
      setTimeout(() => { setDirection(1); setCurrentStep(2); }, 1000);
    }
  }, [approveSuccess, currentStep]);

  useEffect(() => {
    if (remitSuccess && !txSuccess) {
      setTxSuccess(true);
      const end = Date.now() + 2000;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#2dd4bf", "#14b8a6", "#5eead4"] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#2dd4bf", "#14b8a6", "#5eead4"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [remitSuccess, txSuccess]);

  const goNext = () => { if (currentStep < 2) { setDirection(1); setCurrentStep((s) => s + 1); } };
  const goBack = () => { if (currentStep > 0) { setDirection(-1); setCurrentStep((s) => s - 1); } };
  const handleApprove = () => { if (formData.amount) approve(parseEther(formData.amount)); };
  const handleSend = () => {
    if (formData.recipient && formData.amount)
      createRemittance(formData.recipient as `0x${string}`, parseEther(formData.amount));
  };

  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep via-brand-deep/95 to-brand-navy/50 z-0" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">Send Remittance</h1>
          <p className="text-white/50">Transfer HKD to PHP in three simple steps</p>
          {isConnected && <p className="text-xs text-white/40 mt-1">Balance: {formattedBalance} HKDR</p>}
        </motion.div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div key={step.id} className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300",
                    isActive && "bg-brand-mint/15 border border-brand-mint/40 text-brand-mint shadow-neon-mint",
                    isCompleted && "bg-brand-mint/10 border border-brand-mint/20 text-brand-mint",
                    !isActive && !isCompleted && "bg-white/5 border border-white/10 text-white/40"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  <span className="hidden sm:inline">{step.label}</span>
                </motion.div>
                {index < 2 && (
                  <motion.div animate={{ color: index < currentStep ? "rgb(45,212,191)" : "rgba(255,255,255,0.2)" }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="glass-card p-8 overflow-hidden min-h-[350px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={currentStep} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }}>

              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">Transfer Details</h2>
                    <p className="text-sm text-white/50">Enter the recipient address and amount</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Recipient Address</label>
                      <Input placeholder="0x..." value={formData.recipient} onChange={(e) => setFormData({ ...formData, recipient: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Amount (HKD)</label>
                      <Input type="number" placeholder="1000" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                    </div>
                    {numericAmount > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl bg-white/5 p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">They Receive</span>
                          <span className="text-brand-mint font-semibold">₱ {phpAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Fee ({(feeRate * 100).toFixed(1)}%)</span>
                          <span className="text-white/70">{fee.toFixed(2)} HKD</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <Button variant="neon" className="w-full" onClick={goNext} disabled={!formData.recipient || !formData.amount || !isConnected}>
                    {!isConnected ? "Connect Wallet First" : "Continue → Approve HKDR"}
                  </Button>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">Approve HKDR Spending</h2>
                    <p className="text-sm text-white/50">Allow RemicoPay contract to spend your HKDR tokens</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-brand-mint/10 flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-brand-mint" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Approve {formData.amount} HKDR</p>
                        <p className="text-xs text-white/40">One-time approval for this amount</p>
                      </div>
                    </div>
                  </div>
                  {approveError && <p className="text-xs text-red-400">Approval failed. Please try again.</p>}
                  {approveSuccess && <p className="text-xs text-green-400">✓ Approved! Moving to next step...</p>}
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={goBack} className="flex-1" disabled={approvePending || approveConfirming}>← Back</Button>
                    <Button variant="neon" onClick={handleApprove} className="flex-1" disabled={approvePending || approveConfirming || approveSuccess}>
                      {approvePending ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirm in Wallet</> : approveConfirming ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming...</> : approveSuccess ? <><Check className="h-4 w-4" /> Approved!</> : "Approve HKDR →"}
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">{txSuccess ? "Remittance Sent! 🎉" : "Confirm Remittance"}</h2>
                    <p className="text-sm text-white/50">{txSuccess ? "Your transaction is confirmed on Etherlink" : "Review and confirm your transfer"}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Recipient</span>
                      <span className="text-white font-mono text-xs">{formData.recipient ? `${formData.recipient.slice(0, 8)}…${formData.recipient.slice(-6)}` : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Send Amount</span>
                      <span className="text-white font-semibold">{formData.amount} HKD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Fee ({(feeRate * 100).toFixed(1)}%)</span>
                      <span className="text-white/70">{fee.toFixed(2)} HKD</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                      <span className="text-white/70 font-medium">Recipient Gets</span>
                      <span className="text-brand-mint font-bold text-lg">₱ {phpAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  {remitError && <p className="text-xs text-red-400">Transaction failed. Please try again.</p>}
                  {remitHash && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span>Tx:</span>
                      <a href={`https://shadownet.explorer.etherlink.com/tx/${remitHash}`} target="_blank" rel="noopener noreferrer" className="text-brand-mint hover:text-brand-mint-light flex items-center gap-1">
                        {remitHash.slice(0, 12)}…{remitHash.slice(-8)} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {!txSuccess ? (
                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={goBack} className="flex-1" disabled={remitPending || remitConfirming}>← Back</Button>
                      <Button variant="neon" className="flex-1 animate-glow-pulse" onClick={handleSend} disabled={remitPending || remitConfirming}>
                        {remitPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirm in Wallet</> : remitConfirming ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Confirm & Send</>}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="neon" className="w-full" onClick={() => window.location.href = "/status"}>View Transaction Status →</Button>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
