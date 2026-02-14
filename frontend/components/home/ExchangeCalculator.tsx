"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowDown, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useExchangeRate, useFeeBps } from "@/lib/hooks";
import { RATE_SCALE } from "@/lib/contracts";

// Fallback values if contract not deployed yet
const FALLBACK_RATE = 7.35;
const FALLBACK_FEE_RATE = 0.007;

export default function ExchangeCalculator() {
  const [hkdAmount, setHkdAmount] = useState<string>("1000");
  const [prevPhp, setPrevPhp] = useState(0);

  // Read on-chain rate & fee (falls back to mock if contract not deployed)
  const { data: onChainRate } = useExchangeRate();
  const { data: onChainFee } = useFeeBps();

  const exchangeRate = onChainRate
    ? Number(onChainRate as bigint) / Number(RATE_SCALE)
    : FALLBACK_RATE;
  const feeRate = onChainFee
    ? Number(onChainFee as bigint) / 10000
    : FALLBACK_FEE_RATE;

  const numericAmount = parseFloat(hkdAmount) || 0;
  const fee = numericAmount * feeRate;
  const netAmount = numericAmount - fee;
  const phpAmount = netAmount * exchangeRate;

  const handleAmountChange = (value: string) => {
    setPrevPhp(phpAmount);
    setHkdAmount(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      className="glass-card p-8 w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-lg font-semibold text-white">
          Exchange Calculator
        </h3>
        <span className="text-xs text-brand-mint/70 bg-brand-mint/10 px-2 py-1 rounded-full">
          Live Rate
        </span>
      </div>

      {/* Send Amount */}
      <div className="space-y-2 mb-4">
        <label className="text-sm text-white/60">You Send</label>
        <div className="relative">
          <Input
            type="number"
            value={hkdAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="pr-20 text-2xl font-semibold h-14"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-sm font-semibold text-brand-mint">HKD</span>
            <div className="h-6 w-6 rounded-full bg-brand-mint/20 flex items-center justify-center text-xs font-bold text-brand-mint">
              $
            </div>
          </div>
        </div>
      </div>

      {/* Arrow divider */}
      <div className="flex justify-center my-3">
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-10 rounded-full bg-brand-mint/10 border border-brand-mint/30 flex items-center justify-center"
        >
          <ArrowDown className="h-5 w-5 text-brand-mint" />
        </motion.div>
      </div>

      {/* Receive Amount */}
      <div className="space-y-2 mb-6">
        <label className="text-sm text-white/60">They Receive</label>
        <div className="relative rounded-xl border border-white/10 bg-brand-navy/30 px-4 py-3 h-14 flex items-center">
          <span className="text-2xl font-semibold text-white">
            {numericAmount > 0 ? (
              <CountUp
                start={prevPhp}
                end={phpAmount}
                duration={0.6}
                decimals={2}
                separator=","
              />
            ) : (
              "0.00"
            )}
          </span>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-sm font-semibold text-brand-mint">PHP</span>
            <div className="h-6 w-6 rounded-full bg-brand-mint/20 flex items-center justify-center text-xs font-bold text-brand-mint">
              ₱
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="space-y-2 mb-6 rounded-xl bg-white/5 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/50 flex items-center gap-1">
            <Info className="h-3 w-3" /> Exchange Rate
          </span>
          <span className="text-white/80">1 HKD = {exchangeRate} PHP</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Fee ({(feeRate * 100).toFixed(1)}%)</span>
          <span className="text-white/80">
            {fee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} HKD
          </span>
        </div>
        <div className="flex justify-between text-sm border-t border-white/10 pt-2">
          <span className="text-white/70 font-medium">Total Cost</span>
          <span className="text-white font-semibold">
            {numericAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} HKD
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link href="/send">
        <Button variant="neon" className="w-full h-12 text-base">
          Send Now →
        </Button>
      </Link>
    </motion.div>
  );
}
