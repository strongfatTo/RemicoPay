"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  History,
  ArrowUpRight,
  ExternalLink,
  Loader2,
  Wallet,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatTokenAmount, shortenAddress, formatTimestamp } from "@/lib/utils";
import { useAccount } from "wagmi";
import { usePublicClient } from "wagmi";
import { ADDRESSES, RemicoPayABI, RATE_SCALE } from "@/lib/contracts";
import { parseAbiItem, type Log } from "viem";

interface RemittanceEvent {
  remitId: bigint;
  sender: string;
  recipient: string;
  hkdAmount: bigint;
  phpAmount: bigint;
  fee: bigint;
  rate: bigint;
  transactionHash: string;
  blockNumber: bigint;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export default function HistoryPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<RemittanceEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchHistory = async () => {
    if (!address || !publicClient) return;

    setIsLoading(true);
    try {
      // Fetch RemittanceCreated events where sender is the connected wallet
      const logs = await publicClient.getLogs({
        address: ADDRESSES.RemicoPay as `0x${string}`,
        event: parseAbiItem(
          "event RemittanceCreated(uint256 indexed remitId, address indexed sender, address indexed recipient, uint256 hkdAmount, uint256 phpAmount, uint256 fee, uint256 rate)"
        ),
        args: {
          sender: address,
        },
        fromBlock: 0n,
        toBlock: "latest",
      });

      const parsed: RemittanceEvent[] = logs.map((log: any) => ({
        remitId: log.args.remitId,
        sender: log.args.sender,
        recipient: log.args.recipient,
        hkdAmount: log.args.hkdAmount,
        phpAmount: log.args.phpAmount,
        fee: log.args.fee,
        rate: log.args.rate,
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));

      // Show newest first
      setEvents(parsed.reverse());
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  };

  // Auto-fetch when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchHistory();
    }
  }, [isConnected, address]);

  // Stats
  const totalSent = events.reduce((acc, e) => acc + e.hkdAmount, 0n);
  const totalPhp = events.reduce((acc, e) => acc + e.phpAmount, 0n);
  const totalFees = events.reduce((acc, e) => acc + e.fee, 0n);

  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep via-brand-deep/95 to-brand-navy/50 z-0" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 pt-20 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
            Transaction History
          </h1>
          <p className="text-white/50">
            All remittances from your connected wallet
          </p>
        </motion.div>

        {/* Not Connected */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <Wallet className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">
              Connect Your Wallet
            </p>
            <p className="text-white/40 text-sm">
              Connect your wallet to view your remittance history
            </p>
          </motion.div>
        )}

        {/* Connected — Content */}
        {isConnected && (
          <>
            {/* Summary Stats */}
            {events.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-8"
              >
                <div className="glass-card p-4 text-center">
                  <p className="text-xs text-white/40 mb-1">Total Sent</p>
                  <p className="text-lg font-bold text-white">
                    {formatTokenAmount(totalSent, 18, 0)}
                  </p>
                  <p className="text-xs text-white/40">HKDR</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-xs text-white/40 mb-1">Total Delivered</p>
                  <p className="text-lg font-bold text-brand-mint">
                    ₱{formatTokenAmount(totalPhp, 18, 0)}
                  </p>
                  <p className="text-xs text-white/40">PHP</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-xs text-white/40 mb-1">Transactions</p>
                  <p className="text-lg font-bold text-white">
                    {events.length}
                  </p>
                  <p className="text-xs text-white/40">Total</p>
                </div>
              </motion.div>
            )}

            {/* Refresh Button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchHistory}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                <span className="ml-1">Refresh</span>
              </Button>
            </div>

            {/* Loading */}
            {isLoading && !hasLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-brand-mint mx-auto mb-4" />
                <p className="text-white/50">
                  Scanning on-chain events...
                </p>
              </motion.div>
            )}

            {/* Empty State */}
            {hasLoaded && events.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 text-center"
              >
                <Inbox className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">
                  No Transactions Yet
                </p>
                <p className="text-white/40 text-sm mb-4">
                  You haven&apos;t sent any remittances yet. Make sure the
                  contract is deployed and you&apos;ve sent at least one
                  transaction.
                </p>
                <a href="/send">
                  <Button variant="neon">Send Your First Remittance →</Button>
                </a>
              </motion.div>
            )}

            {/* Transaction Cards */}
            {events.length > 0 && (
              <div className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event.transactionHash + event.remitId.toString()}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    whileHover={{
                      y: -2,
                      transition: { duration: 0.2 },
                    }}
                    className="glass-card p-5 group hover:border-brand-mint/20 hover:shadow-[0_4px_20px_rgba(45,212,191,0.08)] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Icon + Details */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-mint/10 flex items-center justify-center">
                          <ArrowUpRight className="h-5 w-5 text-brand-mint" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-white">
                              Remittance #{event.remitId.toString()}
                            </p>
                            <Badge variant="outline" className="text-[10px]">
                              Sent
                            </Badge>
                          </div>
                          <p className="text-xs text-white/40 truncate">
                            To: {shortenAddress(event.recipient, 6)}
                          </p>
                        </div>
                      </div>

                      {/* Right: Amounts */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-white">
                          {formatTokenAmount(event.hkdAmount)} HKDR
                        </p>
                        <p className="text-xs text-brand-mint font-medium">
                          → ₱{formatTokenAmount(event.phpAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Bottom row: rate + tx link */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/30">
                      <span>
                        Rate: 1 HKD ={" "}
                        {(Number(event.rate) / Number(RATE_SCALE)).toFixed(2)}{" "}
                        PHP · Fee: {formatTokenAmount(event.fee)} HKDR
                      </span>
                      <a
                        href={`https://shadownet.explorer.etherlink.com/tx/${event.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-brand-mint/50 hover:text-brand-mint transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Explorer</span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
