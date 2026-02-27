"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ADDRESSES, RemicoPayABI, MockHKDRABI, ScheduledRemittanceABI, FPSVerifierABI } from "./contracts";

// ===== Read Hooks =====

/** Read HKDR balance of the connected wallet */
export function useHKDRBalance() {
  const { address } = useAccount();
  return useReadContract({
    address: ADDRESSES.MockHKDR as `0x${string}`,
    abi: MockHKDRABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

/** Read exchange rate from RemicoPay contract */
export function useExchangeRate() {
  return useReadContract({
    address: ADDRESSES.RemicoPay as `0x${string}`,
    abi: RemicoPayABI,
    functionName: "exchangeRate",
  });
}

/** Read fee bps from RemicoPay contract */
export function useFeeBps() {
  return useReadContract({
    address: ADDRESSES.RemicoPay as `0x${string}`,
    abi: RemicoPayABI,
    functionName: "feeBps",
  });
}

/** Get quote for a given HKD amount */
export function useQuote(hkdAmount: bigint) {
  return useReadContract({
    address: ADDRESSES.RemicoPay as `0x${string}`,
    abi: RemicoPayABI,
    functionName: "getQuote",
    args: [hkdAmount],
    query: { enabled: hkdAmount > 0n },
  });
}

/** Get remittance details by ID */
export function useRemittance(remitId: bigint) {
  return useReadContract({
    address: ADDRESSES.RemicoPay as `0x${string}`,
    abi: RemicoPayABI,
    functionName: "getRemittance",
    args: [remitId],
    query: { enabled: remitId > 0n },
  });
}

/** Read next remittance ID (for counting total remittances) */
export function useNextRemitId() {
  return useReadContract({
    address: ADDRESSES.RemicoPay as `0x${string}`,
    abi: RemicoPayABI,
    functionName: "nextRemitId",
  });
}

/** Read HKDR allowance for RemicoPay contract */
export function useHKDRAllowance() {
  const { address } = useAccount();
  return useReadContract({
    address: ADDRESSES.MockHKDR as `0x${string}`,
    abi: MockHKDRABI,
    functionName: "allowance",
    args: address ? [address, ADDRESSES.RemicoPay as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });
}

// ===== Write Hooks =====

/** Claim HKDR from faucet */
export function useFaucet() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claim = () => {
    writeContract({
      address: ADDRESSES.MockHKDR as `0x${string}`,
      abi: MockHKDRABI,
      functionName: "faucet",
    });
  };

  return { claim, hash, isPending, isConfirming, isSuccess, error };
}

/** Approve HKDR spending for RemicoPay */
export function useApproveHKDR() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (amount: bigint) => {
    writeContract({
      address: ADDRESSES.MockHKDR as `0x${string}`,
      abi: MockHKDRABI,
      functionName: "approve",
      args: [ADDRESSES.RemicoPay as `0x${string}`, amount],
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

/** Create a remittance */
export function useCreateRemittance() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const send = (recipient: `0x${string}`, hkdAmount: bigint) => {
    writeContract({
      address: ADDRESSES.RemicoPay as `0x${string}`,
      abi: RemicoPayABI,
      functionName: "createRemittance",
      args: [recipient, hkdAmount],
    });
  };

  return { send, hash, isPending, isConfirming, isSuccess, error };
}

// ===== Scheduled Remittance Hooks =====

/** Schedule a future remittance */
export function useScheduleRemittance() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const schedule = (
    recipient: `0x${string}`,
    hkdAmount: bigint,
    scheduledDate: bigint,
    isRecurring: boolean,
    recurringDay: number
  ) => {
    writeContract({
      address: ADDRESSES.ScheduledRemittance as `0x${string}`,
      abi: ScheduledRemittanceABI.abi,
      functionName: "scheduleRemittance",
      args: [recipient, hkdAmount, scheduledDate, isRecurring, recurringDay],
    });
  };

  return { schedule, hash, isPending, isConfirming, isSuccess, error };
}

/** Get quote for a scheduled remittance */
export function useScheduleQuote(scheduleId: bigint) {
  return useReadContract({
    address: ADDRESSES.ScheduledRemittance as `0x${string}`,
    abi: ScheduledRemittanceABI.abi,
    functionName: "getScheduleQuote",
    args: [scheduleId],
    query: { enabled: scheduleId >= 0n },
  });
}

/** Execute a scheduled remittance (keeper) */
export function useExecuteSchedule() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const execute = (scheduleId: bigint) => {
    writeContract({
      address: ADDRESSES.ScheduledRemittance as `0x${string}`,
      abi: ScheduledRemittanceABI.abi,
      functionName: "executeRemittance",
      args: [scheduleId],
    });
  };

  return { execute, hash, isPending, isConfirming, isSuccess, error };
}

/** Cancel a scheduled remittance */
export function useCancelSchedule() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancel = (scheduleId: bigint) => {
    writeContract({
      address: ADDRESSES.ScheduledRemittance as `0x${string}`,
      abi: ScheduledRemittanceABI.abi,
      functionName: "cancelSchedule",
      args: [scheduleId],
    });
  };

  return { cancel, hash, isPending, isConfirming, isSuccess, error };
}

/** Approve HKDR spending for ScheduledRemittance contract */
export function useApproveHKDRForSchedule() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (amount: bigint) => {
    writeContract({
      address: ADDRESSES.MockHKDR as `0x${string}`,
      abi: MockHKDRABI,
      functionName: "approve",
      args: [ADDRESSES.ScheduledRemittance as `0x${string}`, amount],
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

// ===== FPS Hooks =====

/** Create a remittance with FPS payment */
export function useCreateRemittanceWithFPS() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const send = (recipient: `0x${string}`, hkdAmount: bigint, fpsPaymentRef: `0x${string}`) => {
    writeContract({
      address: ADDRESSES.RemicoPay as `0x${string}`,
      abi: RemicoPayABI,
      functionName: "createRemittanceWithFPS",
      args: [recipient, hkdAmount, fpsPaymentRef],
    });
  };

  return { send, hash, isPending, isConfirming, isSuccess, error };
}

/** Check FPS payment verification status */
export function useFPSPaymentStatus(paymentRef: `0x${string}`) {
  return useReadContract({
    address: ADDRESSES.FPSVerifier as `0x${string}`,
    abi: FPSVerifierABI.abi,
    functionName: "isPaymentVerified",
    args: [paymentRef],
    query: { enabled: !!paymentRef },
  });
}

// ===== Schedule Queries =====

/** Read a schedule's on-chain data by ID */
export function useScheduleData(scheduleId: bigint) {
  return useReadContract({
    address: ADDRESSES.ScheduledRemittance as `0x${string}`,
    abi: ScheduledRemittanceABI.abi,
    functionName: "schedules",
    args: [scheduleId],
    query: { enabled: scheduleId >= 0n },
  });
}

/** Read HKDR allowance for ScheduledRemittance contract */
export function useHKDRAllowanceForSchedule() {
  const { address } = useAccount();
  return useReadContract({
    address: ADDRESSES.MockHKDR as `0x${string}`,
    abi: MockHKDRABI,
    functionName: "allowance",
    args: address ? [address, ADDRESSES.ScheduledRemittance as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });
}

// ===== Utilities =====
export { parseEther, formatEther };
