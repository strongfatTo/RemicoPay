"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ADDRESSES, RemicoPayABI, MockHKDRABI } from "./contracts";

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

// ===== Utilities =====
export { parseEther, formatEther };
