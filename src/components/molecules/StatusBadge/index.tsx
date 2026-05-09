"use client";

import { cn } from "@/lib/utils";
import type { CompanyStatus } from "@/lib/zod/company";
import type { AccreditationStatus } from "@/lib/zod/investor";
import type { PipelineStage } from "@/lib/zod/funding";
import type { DocumentStatus } from "@/lib/zod/document";

type Status = CompanyStatus | AccreditationStatus | PipelineStage | DocumentStatus | string;

const STATUS_CONFIG: Record<string, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  // Company statuses
  PENDING_REVIEW: { label: "Pending Review", dotColor: "bg-warning-500", bgColor: "bg-warning-50", textColor: "text-warning-600" },
  KYC_IN_PROGRESS: { label: "KYC In Progress", dotColor: "bg-flag-500", bgColor: "bg-flag-50", textColor: "text-flag-600" },
  ACTIVE: { label: "Active", dotColor: "bg-success-500", bgColor: "bg-success-50", textColor: "text-success-600" },
  SUSPENDED: { label: "Suspended", dotColor: "bg-danger-500", bgColor: "bg-danger-50", textColor: "text-danger-600" },
  REJECTED: { label: "Rejected", dotColor: "bg-danger-500", bgColor: "bg-danger-50", textColor: "text-danger-600" },
  // Investor statuses
  PENDING: { label: "Pending", dotColor: "bg-warning-500", bgColor: "bg-warning-50", textColor: "text-warning-600" },
  IN_REVIEW: { label: "In Review", dotColor: "bg-flag-500", bgColor: "bg-flag-50", textColor: "text-flag-600" },
  ACCREDITED: { label: "Accredited", dotColor: "bg-success-500", bgColor: "bg-success-50", textColor: "text-success-600" },
  EXPIRED: { label: "Expired", dotColor: "bg-neutral-400", bgColor: "bg-neutral-100", textColor: "text-neutral-600" },
  // Funding stages
  APPLICATION: { label: "Application", dotColor: "bg-neutral-400", bgColor: "bg-neutral-100", textColor: "text-neutral-600" },
  DOCUMENT_REVIEW: { label: "Document Review", dotColor: "bg-flag-500", bgColor: "bg-flag-50", textColor: "text-flag-600" },
  AI_ANALYSIS: { label: "AI Analysis", dotColor: "bg-brand-500", bgColor: "bg-brand-50", textColor: "text-brand-600" },
  COMMITTEE_REVIEW: { label: "Committee Review", dotColor: "bg-warning-500", bgColor: "bg-warning-50", textColor: "text-warning-600" },
  APPROVED: { label: "Approved", dotColor: "bg-success-500", bgColor: "bg-success-50", textColor: "text-success-600" },
  DISBURSEMENT: { label: "Disbursement", dotColor: "bg-brand-accent", bgColor: "bg-brand-50", textColor: "text-brand-600" },
  COMPLETED: { label: "Completed", dotColor: "bg-success-500", bgColor: "bg-success-50", textColor: "text-success-600" },
  // Document statuses
  UNDER_REVIEW: { label: "Under Review", dotColor: "bg-flag-500", bgColor: "bg-flag-50", textColor: "text-flag-600" },
};

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "sm", className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status.replace(/_/g, " "),
    dotColor: "bg-neutral-400",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.bgColor,
        config.textColor,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      {config.label}
    </span>
  );
}
