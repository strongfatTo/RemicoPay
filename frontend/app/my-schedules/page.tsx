"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Loader2,
  Wallet,
  RefreshCw,
  Inbox,
  Play,
  Ban,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatTokenAmount, shortenAddress, formatTimestamp } from "@/lib/utils";
import { useAccount, usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import {
  useExecuteSchedule,
  useCancelSchedule,
  useScheduleQuote,
} from "@/lib/hooks";
import { ADDRESSES, ScheduledRemittanceABI } from "@/lib/contracts";

interface ScheduleEvent {
  scheduleId: bigint;
  sender: string;
  recipient: string;
  hkdAmount: bigint;
  vaultShares: bigint;
  scheduledDate: bigint;
  isRecurring: boolean;
  transactionHash: string;
}

interface ScheduleOnChain {
  sender: string;
  recipient: string;
  hkdAmount: bigint;
  vaultShares: bigint;
  scheduledDate: bigint;
  createdAt: bigint;
  isRecurring: boolean;
  recurringDay: number;
  status: number; // 0=Scheduled, 1=Executed, 2=Cancelled
}

const STATUS_MAP: Record<number, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  0: { label: "Active", color: "text-brand-mint", icon: CalendarClock },
  1: { label: "Executed", color: "text-green-400", icon: CheckCircle2 },
  2: { label: "Cancelled", color: "text-red-400", icon: XCircle },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

function ScheduleCard({
  schedule,
  index,
  onRefresh,
}: {
  schedule: ScheduleEvent & { onChain?: ScheduleOnChain };
  index: number;
  onRefresh: () => void;
}) {
  const status = schedule.onChain?.status ?? 0;
  const statusInfo = STATUS_MAP[status] ?? STATUS_MAP[0];
  const StatusIcon = statusInfo.icon;
  const isPastDue = Date.now() / 1000 > Number(schedule.scheduledDate);
  const isActive = status === 0;

  const { execute, isPending: execPending, isConfirming: execConfirming, isSuccess: execSuccess } = useExecuteSchedule();
  const { cancel, isPending: cancelPending, isConfirming: cancelConfirming, isSuccess: cancelSuccess } = useCancelSchedule();

  // Read live quote for active schedules
  const { data: quoteData } = useScheduleQuote(isActive ? schedule.scheduleId : -1n);

  useEffect(() => {
    if (execSuccess || cancelSuccess) {
      setTimeout(onRefresh, 2000);
    }
  }, [execSuccess, cancelSuccess, onRefresh]);

  const quote = quoteData as [bigint, bigint, bigint, bigint, bigint] | undefined;
  const currentValue = quote?.[0];
  const estimatedYield = quote?.[1];
  const effectiveFee = quote?.[3];

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="glass-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className={cn("h-4 w-4", statusInfo.color)} />
          <span className={cn("text-sm font-semibold", statusInfo.color)}>{statusInfo.label}</span>
          {isActive && isPastDue && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Ready</Badge>
          )}
          {schedule.isRecurring && (
            <Badge className="bg-brand-mint/10 text-brand-mint border-brand-mint/20 text-xs">Recurring</Badge>
          )}
        </div>
        <span className="text-xs text-white/30">#{schedule.scheduleId.toString()}</span>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Recipient</span>
          <span className="text-white font-mono text-xs">{shortenAddress(schedule.recipient)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Deposit</span>
          <span className="text-white font-semibold">{formatTokenAmount(schedule.hkdAmount, 18, 2)} HKD</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Scheduled Date</span>
          <span className="text-white">{formatTimestamp(Number(schedule.scheduledDate))}</span>
        </div>
        {isActive && estimatedYield !== undefined && estimatedYield > 0n && (
          <div className="flex justify-between text-sm">
            <span className="text-white/50 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Yield Earned</span>
            <span className="text-green-400 font-semibold">+{formatTokenAmount(estimatedYield, 18, 4)} HKD</span>
          </div>
        )}
        {isActive && currentValue !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Current Value</span>
            <span className="text-brand-mint font-semibold">{formatTokenAmount(currentValue, 18, 2)} HKD</span>
          </div>
        )}
        {isActive && effectiveFee !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Effective Fee</span>
            <span className={cn("font-semibold", effectiveFee === 0n ? "text-green-400" : "text-white/70")}>
              {effectiveFee === 0n ? "FREE" : `${formatTokenAmount(effectiveFee, 18, 2)} HKD`}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {isActive && (
        <div className="flex gap-2 pt-2 border-t border-white/5">
          {isPastDue && (
            <Button
              variant="neon"
              size="sm"
              className="flex-1"
              onClick={() => execute(schedule.scheduleId)}
              disabled={execPending || execConfirming}
            >
              {execPending || execConfirming ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
              {execSuccess ? "Executed!" : "Execute Now"}
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => cancel(schedule.scheduleId)}
            disabled={cancelPending || cancelConfirming}
          >
            {cancelPending || cancelConfirming ? <Loader2 className="h-3 w-3 animate-spin" /> : <Ban className="h-3 w-3" />}
            {cancelSuccess ? "Cancelled!" : "Cancel"}
          </Button>
        </div>
      )}

      {/* Tx link */}
      <a
        href={`https://shadownet.explorer.etherlink.com/tx/${schedule.transactionHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-white/30 hover:text-brand-mint transition-colors"
      >
        View on Explorer <ExternalLink className="h-3 w-3" />
      </a>
    </motion.div>
  );
}

export default function MySchedulesPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [schedules, setSchedules] = useState<(ScheduleEvent & { onChain?: ScheduleOnChain })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "executed" | "cancelled">("all");

  const fetchSchedules = useCallback(async () => {
    if (!address || !publicClient) return;
    setIsLoading(true);
    try {
      // Fetch ScheduleCreated events for this sender
      const logs = await publicClient.getLogs({
        address: ADDRESSES.ScheduledRemittance as `0x${string}`,
        event: parseAbiItem(
          "event ScheduleCreated(uint256 indexed scheduleId, address indexed sender, address indexed recipient, uint256 hkdAmount, uint256 vaultShares, uint64 scheduledDate, bool isRecurring)"
        ),
        args: { sender: address },
        fromBlock: 0n,
        toBlock: "latest",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed: ScheduleEvent[] = logs.map((log: any) => ({
        scheduleId: log.args.scheduleId,
        sender: log.args.sender,
        recipient: log.args.recipient,
        hkdAmount: log.args.hkdAmount,
        vaultShares: log.args.vaultShares,
        scheduledDate: log.args.scheduledDate,
        isRecurring: log.args.isRecurring,
        transactionHash: log.transactionHash,
      }));

      // Fetch on-chain status for each schedule
      const withStatus = await Promise.all(
        parsed.map(async (s) => {
          try {
            const data = await publicClient.readContract({
              address: ADDRESSES.ScheduledRemittance as `0x${string}`,
              abi: ScheduledRemittanceABI.abi,
              functionName: "schedules",
              args: [s.scheduleId],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any[];
            const onChain: ScheduleOnChain = {
              sender: data[0],
              recipient: data[1],
              hkdAmount: data[2],
              vaultShares: data[3],
              scheduledDate: data[4],
              createdAt: data[5],
              isRecurring: data[6],
              recurringDay: Number(data[7]),
              status: Number(data[8]),
            };
            return { ...s, onChain };
          } catch {
            return s;
          }
        })
      );

      setSchedules(withStatus.reverse());
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, [address, publicClient]);

  useEffect(() => {
    if (isConnected && address) fetchSchedules();
  }, [isConnected, address, fetchSchedules]);

  const filtered = schedules.filter((s) => {
    if (filter === "all") return true;
    const status = s.onChain?.status ?? 0;
    if (filter === "active") return status === 0;
    if (filter === "executed") return status === 1;
    if (filter === "cancelled") return status === 2;
    return true;
  });

  const activeCount = schedules.filter((s) => (s.onChain?.status ?? 0) === 0).length;

  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep via-brand-deep/95 to-brand-navy/50 z-0" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 pt-20 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">My Schedules</h1>
          <p className="text-white/50">View and manage your scheduled remittances</p>
        </motion.div>

        {!isConnected ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center">
            <Wallet className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">Connect Your Wallet</p>
            <p className="text-white/40 text-sm">Connect your wallet to view your scheduled remittances</p>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            {schedules.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-card p-4 text-center">
                  <p className="text-xs text-white/40 mb-1">Active</p>
                  <p className="text-lg font-bold text-brand-mint">{activeCount}</p>
                  <p className="text-xs text-white/40">Earning Yield</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-xs text-white/40 mb-1">Total Scheduled</p>
                  <p className="text-lg font-bold text-white">{schedules.length}</p>
                  <p className="text-xs text-white/40">All Time</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-xs text-white/40 mb-1">Total Deposited</p>
                  <p className="text-lg font-bold text-white">
                    {formatTokenAmount(schedules.reduce((acc, s) => acc + s.hkdAmount, 0n), 18, 0)}
                  </p>
                  <p className="text-xs text-white/40">HKDR</p>
                </div>
              </motion.div>
            )}

            {/* Filter tabs + Refresh */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(["all", "active", "executed", "cancelled"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      filter === f
                        ? "bg-brand-mint/15 border-brand-mint/40 text-brand-mint"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
                    )}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={fetchSchedules} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                <span className="ml-1">Refresh</span>
              </Button>
            </div>

            {/* Loading */}
            {isLoading && !hasLoaded && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-mint mx-auto mb-4" />
                <p className="text-white/50 text-sm">Loading your schedules...</p>
              </motion.div>
            )}

            {/* Empty */}
            {hasLoaded && filtered.length === 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center">
                <Inbox className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">
                  {filter === "all" ? "No Scheduled Remittances" : `No ${filter} schedules`}
                </p>
                <p className="text-white/40 text-sm mb-4">
                  {filter === "all" ? "Schedule your first remittance to start earning yield" : "Try a different filter"}
                </p>
                {filter === "all" && (
                  <Button variant="neon" size="sm" onClick={() => window.location.href = "/schedule"}>
                    <CalendarClock className="h-4 w-4" /> Schedule a Remittance
                  </Button>
                )}
              </motion.div>
            )}

            {/* Schedule Cards */}
            <div className="space-y-4">
              {filtered.map((schedule, i) => (
                <ScheduleCard
                  key={schedule.scheduleId.toString()}
                  schedule={schedule}
                  index={i}
                  onRefresh={fetchSchedules}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
