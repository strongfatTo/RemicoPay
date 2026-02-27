"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  Check,
  Wallet,
  FileCheck,
  CalendarClock,
  Send,
  Loader2,
  ExternalLink,
  TrendingUp,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  useApproveHKDRForSchedule,
  useScheduleRemittance,
  useHKDRBalance,
  useExchangeRate,
  useFeeBps,
} from "@/lib/hooks";
import { RATE_SCALE } from "@/lib/contracts";

const steps = [
  { id: 0, label: "Details", icon: FileCheck },
  { id: 1, label: "Preview", icon: TrendingUp },
  { id: 2, label: "Approve", icon: Wallet },
  { id: 3, label: "Confirm", icon: Send },
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

export default function SchedulePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    scheduledDate: "",
    isRecurring: false,
    recurringDay: 1,
  });
  const [txSuccess, setTxSuccess] = useState(false);

  const { isConnected } = useAccount();
  const { data: balance } = useHKDRBalance();
  const { data: onChainRate } = useExchangeRate();
  const { data: onChainFee } = useFeeBps();

  const {
    approve,
    isPending: approvePending,
    isConfirming: approveConfirming,
    isSuccess: approveSuccess,
    error: approveError,
  } = useApproveHKDRForSchedule();

  const {
    schedule: createSchedule,
    hash: scheduleHash,
    isPending: schedulePending,
    isConfirming: scheduleConfirming,
    isSuccess: scheduleSuccess,
    error: scheduleError,
  } = useScheduleRemittance();

  const exchangeRate = onChainRate ? Number(onChainRate as bigint) / Number(RATE_SCALE) : 7.35;
  const feeRate = onChainFee ? Number(onChainFee as bigint) / 10000 : 0.007;
  const numericAmount = parseFloat(formData.amount) || 0;
  const baseFee = numericAmount * feeRate;
  const formattedBalance = balance
    ? Number(formatEther(balance as bigint)).toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "0";

  // Estimate days until execution for yield preview
  const daysUntilExec = useMemo(() => {
    if (!formData.scheduledDate) return 0;
    const diff = new Date(formData.scheduledDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [formData.scheduledDate]);

  // Mock yield estimate: ~5% APY pro-rated
  const estimatedYield = numericAmount * 0.05 * (daysUntilExec / 365);
  const userYieldShare = estimatedYield * 0.7;
  const effectiveFee = Math.max(0, baseFee - userYieldShare);
  const feeDiscount = baseFee > 0 ? ((baseFee - effectiveFee) / baseFee) * 100 : 0;
  const estimatedPhpWithYield = (numericAmount - effectiveFee + Math.max(0, userYieldShare - baseFee)) * exchangeRate;

  // Auto-advance after approve
  useEffect(() => {
    if (approveSuccess && currentStep === 2) {
      setTimeout(() => { setDirection(1); setCurrentStep(3); }, 1000);
    }
  }, [approveSuccess, currentStep]);

  // Confetti on success
  useEffect(() => {
    if (scheduleSuccess && !txSuccess) {
      setTxSuccess(true);
      const end = Date.now() + 2000;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#2dd4bf", "#14b8a6", "#5eead4"] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#2dd4bf", "#14b8a6", "#5eead4"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [scheduleSuccess, txSuccess]);

  const goNext = () => { if (currentStep < 3) { setDirection(1); setCurrentStep((s) => s + 1); } };
  const goBack = () => { if (currentStep > 0) { setDirection(-1); setCurrentStep((s) => s - 1); } };

  const handleApprove = () => {
    if (formData.amount) approve(parseEther(formData.amount));
  };

  const handleSchedule = () => {
    if (formData.recipient && formData.amount && formData.scheduledDate) {
      const scheduledTimestamp = BigInt(Math.floor(new Date(formData.scheduledDate).getTime() / 1000));
      createSchedule(
        formData.recipient as `0x${string}`,
        parseEther(formData.amount),
        scheduledTimestamp,
        formData.isRecurring,
        formData.isRecurring ? formData.recurringDay : 0
      );
    }
  };

  const isDetailsValid = formData.recipient && formData.amount && formData.scheduledDate &&
    new Date(formData.scheduledDate) > new Date();

  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep via-brand-deep/95 to-brand-navy/50 z-0" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">Schedule Remittance</h1>
          <p className="text-white/50">Schedule a future transfer and earn yield while you wait</p>
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
                {index < 3 && (
                  <motion.div animate={{ color: index < currentStep ? "rgb(45,212,191)" : "rgba(255,255,255,0.2)" }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="glass-card p-8 overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={currentStep} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }}>

              {/* Step 0: Details */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">Schedule Details</h2>
                    <p className="text-sm text-white/50">Set recipient, amount, and future execution date</p>
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
                    <div className="space-y-2">
                      <label className="text-sm text-white/60">Scheduled Date</label>
                      <Input
                        type="date"
                        value={formData.scheduledDate}
                        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      />
                    </div>
                    {/* Recurring toggle */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isRecurring: !formData.isRecurring })}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm border transition-all",
                          formData.isRecurring
                            ? "bg-brand-mint/15 border-brand-mint/40 text-brand-mint"
                            : "bg-white/5 border-white/10 text-white/50 hover:text-white/70"
                        )}
                      >
                        <Repeat className="h-4 w-4" />
                        Recurring Monthly
                      </button>
                      {formData.isRecurring && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/40">Day:</span>
                          <Input
                            type="number"
                            min={1}
                            max={28}
                            value={formData.recurringDay}
                            onChange={(e) => setFormData({ ...formData, recurringDay: Math.min(28, Math.max(1, parseInt(e.target.value) || 1)) })}
                            className="w-16 text-center"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="neon" className="w-full" onClick={goNext} disabled={!isDetailsValid || !isConnected}>
                    {!isConnected ? "Connect Wallet First" : "Continue → Preview"}
                  </Button>
                </div>
              )}

              {/* Step 1: Preview */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">Yield Preview</h2>
                    <p className="text-sm text-white/50">Your funds earn yield until the scheduled date</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Amount</span>
                      <span className="text-white font-semibold">{numericAmount.toLocaleString()} HKD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Scheduled Date</span>
                      <span className="text-white">{formData.scheduledDate ? new Date(formData.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Days Until Execution</span>
                      <span className="text-white">{daysUntilExec} days</span>
                    </div>
                    {formData.isRecurring && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Recurring</span>
                        <span className="text-brand-mint">Every month on day {formData.recurringDay}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Estimated Yield</span>
                        <span className="text-green-400 font-semibold">+{estimatedYield.toFixed(2)} HKD</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Base Fee ({(feeRate * 100).toFixed(1)}%)</span>
                        <span className="text-white/70">{baseFee.toFixed(2)} HKD</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Effective Fee (after yield)</span>
                        <span className={cn("font-semibold", effectiveFee === 0 ? "text-green-400" : "text-white/70")}>
                          {effectiveFee.toFixed(2)} HKD {feeDiscount > 0 && <span className="text-green-400 text-xs">(-{feeDiscount.toFixed(0)}%)</span>}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                        <span className="text-white/70 font-medium">Recipient Gets (est.)</span>
                        <span className="text-brand-mint font-bold text-lg">₱ {estimatedPhpWithYield.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                  {daysUntilExec > 0 && (
                    <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-xs text-green-400">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      The earlier you schedule, the more yield you earn — reducing or eliminating your fee!
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={goBack} className="flex-1">← Back</Button>
                    <Button variant="neon" onClick={goNext} className="flex-1">Continue → Approve</Button>
                  </div>
                </div>
              )}

              {/* Step 2: Approve */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">Approve HKDR Spending</h2>
                    <p className="text-sm text-white/50">Allow ScheduledRemittance contract to deposit your HKDR into the yield vault</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-brand-mint/10 flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-brand-mint" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Approve {formData.amount} HKDR</p>
                        <p className="text-xs text-white/40">One-time approval for this scheduled transfer</p>
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

              {/* Step 3: Confirm */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-white mb-1">{txSuccess ? "Scheduled! 🎉" : "Confirm Schedule"}</h2>
                    <p className="text-sm text-white/50">{txSuccess ? "Your remittance is scheduled and earning yield" : "Review and confirm your scheduled transfer"}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Recipient</span>
                      <span className="text-white font-mono text-xs">{formData.recipient ? `${formData.recipient.slice(0, 8)}…${formData.recipient.slice(-6)}` : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Deposit Amount</span>
                      <span className="text-white font-semibold">{formData.amount} HKD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Execution Date</span>
                      <span className="text-white">{formData.scheduledDate ? new Date(formData.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                    </div>
                    {formData.isRecurring && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Recurring</span>
                        <span className="text-brand-mint">Monthly (day {formData.recurringDay})</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                      <span className="text-white/70 font-medium">Est. Recipient Gets</span>
                      <span className="text-brand-mint font-bold text-lg">₱ {estimatedPhpWithYield.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  {scheduleError && <p className="text-xs text-red-400">Transaction failed. Please try again.</p>}
                  {scheduleHash && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span>Tx:</span>
                      <a href={`https://shadownet.explorer.etherlink.com/tx/${scheduleHash}`} target="_blank" rel="noopener noreferrer" className="text-brand-mint hover:text-brand-mint-light flex items-center gap-1">
                        {scheduleHash.slice(0, 12)}…{scheduleHash.slice(-8)} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {!txSuccess ? (
                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={goBack} className="flex-1" disabled={schedulePending || scheduleConfirming}>← Back</Button>
                      <Button variant="neon" className="flex-1 animate-glow-pulse" onClick={handleSchedule} disabled={schedulePending || scheduleConfirming}>
                        {schedulePending ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirm in Wallet</> : scheduleConfirming ? <><Loader2 className="h-4 w-4 animate-spin" /> Scheduling...</> : <><CalendarClock className="h-4 w-4" /> Confirm Schedule</>}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button variant="secondary" className="flex-1" onClick={() => window.location.href = "/my-schedules"}>View My Schedules</Button>
                      <Button variant="neon" className="flex-1" onClick={() => { setCurrentStep(0); setTxSuccess(false); setFormData({ recipient: "", amount: "", scheduledDate: "", isRecurring: false, recurringDay: 1 }); }}>Schedule Another</Button>
                    </div>
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
