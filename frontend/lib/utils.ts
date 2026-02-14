import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with clsx (shadcn pattern) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a BigInt token amount (18 decimals) to a human-readable string */
export function formatTokenAmount(amount: bigint, decimals = 18, displayDecimals = 2): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, displayDecimals);
  return `${whole.toLocaleString()}.${fractionStr}`;
}

/** Shorten an Ethereum address: 0x1234…abcd */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/** Format a date timestamp (seconds) to local date string */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Remittance status labels */
export const STATUS_LABELS: Record<number, string> = {
  0: "Pending",
  1: "Processing",
  2: "Completed",
  3: "Cancelled",
};

/** Explorer URL for a transaction hash */
export function explorerTxUrl(txHash: string): string {
  return `https://shadownet.explorer.etherlink.com/tx/${txHash}`;
}

/** Explorer URL for an address */
export function explorerAddressUrl(address: string): string {
  return `https://shadownet.explorer.etherlink.com/address/${address}`;
}
