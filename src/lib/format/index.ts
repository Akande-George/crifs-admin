import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

/**
 * Format Naira currency values.
 * Uses the Nigerian convention: ₦1,234,567.89
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format Naira in compact form for large amounts.
 * e.g. ₦1.5B, ₦250M, ₦50K
 */
export function formatNairaCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(0)}K`;
  }
  return `₦${amount}`;
}

/**
 * Format a date string to a human-readable format.
 * Uses Africa/Lagos timezone context.
 */
export function formatDate(date: string | Date, pattern = "dd MMM yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return format(d, pattern);
}

/**
 * Format date as relative time (e.g. "2 hours ago").
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format a date for table display (short).
 */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, "dd/MM/yy");
}

/**
 * Format datetime with time component.
 */
export function formatDateTime(date: string | Date): string {
  return formatDate(date, "dd MMM yyyy, HH:mm");
}

/**
 * Format RC (Registration of Company) number.
 * RC-1234567
 */
export function formatRCNumber(rcNumber: string): string {
  return rcNumber.startsWith("RC") ? rcNumber : `RC-${rcNumber}`;
}

/**
 * Format phone number to +234 format.
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("234")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith("0")) {
    return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Format percentage.
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with commas.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-NG").format(value);
}
/**
 * Format file size in bytes to human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
