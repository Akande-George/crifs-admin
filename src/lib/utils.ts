import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "₦"): string {
  if (amount >= 1_000_000_000) return `${currency}${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${currency}${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${currency}${(amount / 1_000).toFixed(1)}K`;
  return `${currency}${amount.toLocaleString()}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    approved: "text-green-600 bg-green-50 border-green-200",
    verified: "text-green-600 bg-green-50 border-green-200",
    active: "text-green-600 bg-green-50 border-green-200",
    passed: "text-green-600 bg-green-50 border-green-200",
    live: "text-green-600 bg-green-50 border-green-200",
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    "under review": "text-amber-600 bg-amber-50 border-amber-200",
    running: "text-amber-600 bg-amber-50 border-amber-200",
    review: "text-amber-600 bg-amber-50 border-amber-200",
    rejected: "text-red-600 bg-red-50 border-red-200",
    failed: "text-red-600 bg-red-50 border-red-200",
    expired: "text-red-600 bg-red-50 border-red-200",
    flagged: "text-orange-600 bg-orange-50 border-orange-200",
    draft: "text-gray-600 bg-gray-50 border-gray-200",
    "not started": "text-gray-400 bg-gray-50 border-gray-200",
    incomplete: "text-gray-500 bg-gray-50 border-gray-200",
    disbursed: "text-blue-600 bg-blue-50 border-blue-200",
  };
  return map[status.toLowerCase()] ?? "text-gray-600 bg-gray-50 border-gray-200";
}
