"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, Check, Wallet, FileCheck, Send, Loader2, ExternalLink, Landmark, Clock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { parseEther, keccak256, toHex } from "viem";
import {
  useApproveHKDR,
  useCreateRemittance,
  useCreateRemittanceWithFPS,
  useFPSPaymentStatus,
  useHKDRBalance,
  useExchangeRate,
  useFeeBps,
  formatEther,
} from "@/lib/hooks";
import { RATE_SCALE } from "@/lib/contracts";

type PaymentMethod = "wallet" | "fps";

const walletSteps = [
  { id: 0, label: "Details", icon: FileCheck },
  { id: 1, label: "Approve", icon: Wallet },
  { id: 2, label: "Send", icon: Send },
];

const fpsSteps = [
  { id: 0, label: "Details", icon: FileCheck },
  { id: 1, label: "FPS Info", icon: Landmark },
  { id: 2, label: "Submit", icon: Send },
  { id: 3, label: "Waiting", icon: Clock },
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

// Generate a unique FPS reference number
function generateFPSRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RP-${ts}-${rand}`;
}

export default function SendPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({ recipient: "", amount: "" });
  const [txSuccess, setTxSuccess] = useState(false);
  const [fpsRef, setFpsRef] = useState("");
  const [fpsRefBytes32, setFpsRefBytes32] = useState<`0x${string}`>("0x0000000000000000000000000000000000000000000000000000000000000000");

  const steps = paymentMethod === "wallet" ? walletSteps : fpsSteps;
  const maxStep = steps.length - 1;

  const { isConnected } = useAccount();
  const { data: balance } = useHKDRBalance();
  const { data: onChainRate } = useExchangeRate();
  const { data: onChainFee } = useFeeBps();

  // Wallet flow hooks
  const {
    approve, isPending: approvePending,
    isConfirming: approveConfirming, isSuccess: approveSuccess, error: approveError,
  } = useApproveHKDR();

  const {
    send: createRemittance, hash: remitHash, isPending: remitPending,
    isConfirming: remitConfirming, isSuccess: remitSuccess, error: remitError,
  } = useCreateRemittance();

  // FPS flow hooks
  const {
    send: createFPSRemittance, hash: fpsHash, isPending: fpsPending,
    isConfirming: fpsConfirming, isSuccess: fpsSuccess, error: fpsError,
  } = useCreateRemittanceWithFPS();

  const { data: fpsVerified } = useFPSPaymentStatus(fpsRefBytes32);

  const exchangeRate = onChainRate ? Number(onChainRate as bigint) / Number(RATE_SCALE) : 7.35;
  const feeRate = onChainFee ? Number(onChainFee as bigint) / 10000 : 0.007;
  const numericAmount = parseFloat(formData.amount) || 0;
  const fee = numericAmount * feeRate;
  const phpAmount = (numericAmount - fee) * exchangeRate;
  const formattedBalance = balance
    ? Number(formatEther(balance as bigint)).toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "0";

  // Auto-advance after approve (wallet flow)
  useEffect(() => {
    if (approveSuccess && currentStep === 1 && paymentMethod === "wallet") {
      setTimeout(() => { setDirection(1); setCurrentStep(2); }, 1000);
    }
  }, [approveSuccess, currentStep, paymentMethod]);

  // Confetti on wallet success
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

  // Auto-advance FPS after on-chain submission
  useEffect(() => {
    if (fpsSuccess && currentStep === 2 && paymentMethod === "fps") {
      setTimeout(() => { setDirection(1); setCurrentStep(3); }, 1000);
    }
  }, [fpsSuccess, currentStep, paymentMethod]);

  const goNext = () => { if (currentStep < maxStep) { setDirection(1); setCurrentStep((s) => s + 1); } };
  const goBack = () => { if (currentStep > 0) { setDirection(-1); setCurrentStep((s) => s - 1); } };
  const handleApprove = () => { if (formData.amount) approve(parseEther(formData.amount)); };
  const handleSend = () => {
    if (formData.recipient && formData.amount)
      createRemittance(formData.recipient as `0x${string}`, parseEther(formData.amount));
  };

  // FPS: generate ref on step advance
  const handleFPSContinue = () => {
    if (!fpsRef) {
      const ref = generateFPSRef();
      setFpsRef(ref);
      setFpsRefBytes32(keccak256(toHex(ref)));
    }
    goNext();
  };

  const handleFPSSubmit = () => {
    if (formData.recipient && formData.amount && fpsRefBytes32) {
      createFPSRemittance(
        formData.recipient as `0x${string}`,
        parseEther(formData.amount),
        fpsRefBytes32
      );
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(fpsRef);
  };

  // Reset state when switching payment method
  const switchMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setCurrentStep(0);
    setDirection(1);
    setTxSuccess(false);
    setFpsRef("");
  };

  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep via-brand-deep/95 to-brand-navy/50 z-0" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">Send Remittance</h1>
          <p className="text-white/50">Transfer HKD to PHP — choose your payment method</p>
          {isConnected && <p className="text-xs text-white/40 mt-1">Balance: {formattedBalance} HKDR</p>}
        </motion.div>

        {/* Payment Method Selector */}
        {currentStep === 0 && (
          <div className="flex gap-3 justify-center mb-8">
            <button
              onClick={() => switchMethod("wallet")}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all",
                paymentMethod === "wallet"
                  ? "bg-brand-mint/15 border-brand-mint/40 text-brand-mint shadow-neon-mint"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:border-white/20"
              )}
            >
              <Wallet className="h-4 w-4" /> Wallet (HKDR)
            </button>
            <button
              onClick={() => switchMethod("fps")}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all",
                paymentMethod === "fps"
                  ? "bg-brand-mint/15 border-brand-mint/40 text-brand-mint shadow-neon-mint"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:border-white/20"
              )}
            >
              <Landmark className="h-4 w-4" /> FPS Transfer
            </button>
          </div>
        )}

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
                {index < maxStep && (
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
            <motion.div key={`${paymentMethod}-${currentStep}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }}>

              {/* ===== STEP 0: Details (shared) ===== */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">Transfer Details</h2>
                    <p className="text-sm text-white/50">
                      {paymentMethod === "wallet"
                        ? "Enter the recipient address and amount"
                        : "Enter details — you'll pay via FPS bank transfer"}
                    </p>
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
                        {paymentMethod === "fps" && (
                          <div className="flex justify-between text-sm">
                            <span className="text-white/50">Payment</span>
                            <span className="text-white/70 flex items-center gap-1"><Landmark className="h-3 w-3" /> FPS Transfer</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                  <Button
                    variant="neon"
                    className="w-full"
                    onClick={paymentMethod === "wallet" ? goNext : handleFPSContinue}
                    disabled={!formData.recipient || !formData.amount || !isConnected}
                  >
                    {!isConnected ? "Connect Wallet First" : paymentMethod === "wallet" ? "Continue → Approve HKDR" : "Continue → FPS Instructions"}
                  </Button>
                </div>
              )}

              {/* ===== WALLET STEP 1: Approve ===== */}
              {paymentMethod === "wallet" && currentStep === 1 && (
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

              {/* ===== WALLET STEP 2: Confirm & Send ===== */}
              {paymentMethod === "wallet" && currentStep === 2 && (
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

              {/* ===== FPS STEP 1: FPS Instructions ===== */}
              {paymentMethod === "fps" && currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">FPS Payment Instructions</h2>
                    <p className="text-sm text-white/50">Complete the FPS transfer using the details below</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Bank</span>
                        <span className="text-white font-medium">RemicoPay Ltd</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">FPS ID</span>
                        <span className="text-white font-mono">1234567</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Amount</span>
                        <span className="text-white font-bold">{formData.amount} HKD</span>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/50">Reference Number</span>
                          <div className="flex items-center gap-2">
                            <span className="text-brand-mint font-mono font-bold">{fpsRef}</span>
                            <button onClick={handleCopyRef} className="text-white/40 hover:text-white transition-colors">
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 text-xs text-yellow-400">
                    <strong>Important:</strong> Include the reference number in your FPS transfer message. This is required for verification.
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={goBack} className="flex-1">← Back</Button>
                    <Button variant="neon" onClick={goNext} className="flex-1">I&apos;ve Completed FPS →</Button>
                  </div>
                </div>
              )}

              {/* ===== FPS STEP 2: Submit On-Chain ===== */}
              {paymentMethod === "fps" && currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">Submit FPS Remittance</h2>
                    <p className="text-sm text-white/50">Create the on-chain record — no HKDR lock required</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Recipient</span>
                      <span className="text-white font-mono text-xs">{formData.recipient ? `${formData.recipient.slice(0, 8)}…${formData.recipient.slice(-6)}` : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Amount</span>
                      <span className="text-white font-semibold">{formData.amount} HKD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">FPS Reference</span>
                      <span className="text-brand-mint font-mono text-xs">{fpsRef}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Payment</span>
                      <span className="text-white/70 flex items-center gap-1"><Landmark className="h-3 w-3" /> FPS (no HKDR needed)</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                      <span className="text-white/70 font-medium">Recipient Gets</span>
                      <span className="text-brand-mint font-bold text-lg">₱ {phpAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  {fpsError && <p className="text-xs text-red-400">Transaction failed. Please try again.</p>}
                  {fpsHash && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span>Tx:</span>
                      <a href={`https://shadownet.explorer.etherlink.com/tx/${fpsHash}`} target="_blank" rel="noopener noreferrer" className="text-brand-mint hover:text-brand-mint-light flex items-center gap-1">
                        {fpsHash.slice(0, 12)}…{fpsHash.slice(-8)} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={goBack} className="flex-1" disabled={fpsPending || fpsConfirming}>← Back</Button>
                    <Button variant="neon" className="flex-1 animate-glow-pulse" onClick={handleFPSSubmit} disabled={fpsPending || fpsConfirming || fpsSuccess}>
                      {fpsPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirm in Wallet</> : fpsConfirming ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : fpsSuccess ? <><Check className="h-4 w-4" /> Submitted!</> : <><Send className="h-4 w-4" /> Submit On-Chain</>}
                    </Button>
                  </div>
                </div>
              )}

              {/* ===== FPS STEP 3: Waiting for Verification ===== */}
              {paymentMethod === "fps" && currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">
                      {fpsVerified ? "FPS Verified! 🎉" : "Waiting for FPS Confirmation"}
                    </h2>
                    <p className="text-sm text-white/50">
                      {fpsVerified
                        ? "Your FPS payment has been verified — PHPC will be minted to the recipient"
                        : "Our system will confirm your FPS payment automatically"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center",
                        fpsVerified ? "bg-green-500/10" : "bg-yellow-500/10"
                      )}>
                        {fpsVerified
                          ? <Check className="h-6 w-6 text-green-400" />
                          : <Loader2 className="h-6 w-6 text-yellow-400 animate-spin" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {fpsVerified ? "Payment Verified" : "Pending Verification"}
                        </p>
                        <p className="text-xs text-white/40">Reference: {fpsRef}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Amount</span>
                      <span className="text-white font-semibold">{formData.amount} HKD</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                      <span className="text-white/70 font-medium">Recipient Gets</span>
                      <span className="text-brand-mint font-bold text-lg">₱ {phpAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  {!fpsVerified && (
                    <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-xs text-white/40">
                      <Clock className="inline h-3 w-3 mr-1" />
                      FPS payments are typically confirmed within a few minutes. This page will update automatically.
                    </div>
                  )}
                  <Button variant="neon" className="w-full" onClick={() => window.location.href = "/status"}>
                    View Transaction Status →
                  </Button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
