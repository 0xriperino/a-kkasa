import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, symbol: string = "mUSDC"): string {
  return `${amount.toLocaleString("tr-TR")} ${symbol}`;
}

export function formatAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatExplorerUrl(hash: string, network: string = "monad"): string {
  return `https://testnet.monadscan.com/tx/${hash}`;
}

export function calculateProgress(collected: number, target: number): number {
  if (target === 0) return 0;
  const pct = (collected / target) * 100;
  if (pct > 0 && pct < 1) return 1;
  return Math.min(Math.round(pct), 100);
}