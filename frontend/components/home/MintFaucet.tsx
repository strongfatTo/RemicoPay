"use client";

import { motion } from "framer-motion";
import { Droplets, Loader2, CheckCircle2, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useFaucet, useHKDRBalance, formatEther } from "@/lib/hooks";

export default function MintFaucet() {
  const { isConnected } = useAccount();
  const { data: balance, refetch: refetchBalance } = useHKDRBalance();
  const { claim, isPending, isConfirming, isSuccess, error } = useFaucet();

  const handleClaim = () => {
    claim();
    // Refetch balance after a short delay for confirmation
    setTimeout(() => refetchBalance(), 5000);
  };

  const formattedBalance = balance
    ? Number(formatEther(balance as bigint)).toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })
    : "0";

  if (!isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-6 w-full max-w-md mx-auto mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-brand-mint" />
          <h3 className="font-heading text-sm font-semibold text-white">
            Your HKDR Balance
          </h3>
        </div>
        <span className="text-lg font-bold text-brand-mint">
          {formattedBalance} HKDR
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleClaim}
        disabled={isPending || isConfirming}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirm in Wallet...
          </>
        ) : isConfirming ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            Claimed 10,000 HKDR!
          </>
        ) : (
          <>
            <Droplets className="h-4 w-4" />
            Claim 10,000 Test HKDR
          </>
        )}
      </Button>

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error.message.includes("FaucetCooldown")
            ? "Faucet cooldown active — try again in 1 hour"
            : "Transaction failed. Please try again."}
        </p>
      )}
    </motion.div>
  );
}
