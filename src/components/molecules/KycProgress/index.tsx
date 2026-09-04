"use client";

import {
  CheckCircle2,
  XCircle,
  Loader2,
  Circle,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import type {
  KycProgress,
  KycProgressSummary,
  KycStep,
  KycStepStatus,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * Renders the KYC level breakdown the API derives in `kyc-progress.ts`.
 *
 * Nothing here re-derives status — the backend is the single source of truth
 * for which levels exist and which ones gate access, so this file only decides
 * how to draw what it is handed.
 */

const STEP_STYLE: Record<
  KycStepStatus,
  { icon: typeof CheckCircle2; color: string; ring: string; label: string }
> = {
  PASSED: {
    icon: CheckCircle2,
    color: "text-success-600",
    ring: "bg-success-50 border-success-200",
    label: "Passed",
  },
  FAILED: {
    icon: XCircle,
    color: "text-danger-600",
    ring: "bg-danger-50 border-danger-200",
    label: "Failed",
  },
  PENDING: {
    icon: Loader2,
    color: "text-warning-600",
    ring: "bg-warning-50 border-warning-200",
    label: "Awaiting result",
  },
  NOT_STARTED: {
    icon: Circle,
    color: "text-neutral-300",
    ring: "bg-neutral-50 border-neutral-200",
    label: "Not started",
  },
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Compact bar for table rows: "2/3 levels" plus a fill. Takes the summary
 * shape that list endpoints return, so it works without fetching detail.
 */
export function KycProgressBar({
  progress,
  className,
}: {
  progress: KycProgressSummary;
  className?: string;
}) {
  const { requiredPassed, requiredTotal, percent, failedSteps } = progress;
  const barColor = failedSteps.length
    ? "bg-danger-500"
    : percent === 100
      ? "bg-success-500"
      : "bg-warning-500";

  return (
    <div className={cn("min-w-[120px] space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-neutral-700">
          {requiredPassed}/{requiredTotal} levels
        </span>
        {progress.manualOverride === "PASSED" && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
            Manual
          </span>
        )}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${Math.max(percent, failedSteps.length ? 100 : 0)}%` }}
        />
      </div>
      <p className="truncate text-[10px] font-medium text-neutral-400">
        {failedSteps.length
          ? `Failed: ${failedSteps.join(", ")}`
          : progress.blockedBy.length
            ? `Waiting on ${progress.blockedBy.join(", ")}`
            : "All required levels complete"}
      </p>
    </div>
  );
}

function StepRow({ step }: { step: KycStep }) {
  const style = STEP_STYLE[step.status];
  const Icon = style.icon;
  const last = formatDate(step.completedAt ?? step.lastAttemptAt);

  return (
    <li className="flex gap-3 py-3">
      <div
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
          style.ring,
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4",
            style.color,
            step.status === "PENDING" && "animate-spin",
          )}
        />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-neutral-900">{step.label}</p>
          {step.required ? (
            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500">
              Required
            </span>
          ) : (
            <span className="rounded bg-neutral-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
              Optional
            </span>
          )}
          <span className={cn("text-[11px] font-bold", style.color)}>
            {style.label}
          </span>
        </div>
        <p className="text-xs text-neutral-500">{step.description}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 pt-0.5 text-[11px] text-neutral-400">
          {step.satisfiedBy && (
            <span className="font-medium">via {step.satisfiedBy}</span>
          )}
          {step.provider && <span>{step.provider}</span>}
          {step.attempts > 1 && <span>{step.attempts} attempts</span>}
          {last && <span>{last}</span>}
        </div>
        {step.notes && (
          <p className="pt-1 text-xs italic text-neutral-500">{step.notes}</p>
        )}
      </div>
    </li>
  );
}

/**
 * Full checklist for detail pages. `steps` arrives ordered by the backend —
 * required levels first — so it renders in the order an applicant works
 * through them.
 */
export function KycProgressCard({
  progress,
  className,
}: {
  progress: KycProgress;
  className?: string;
}) {
  const complete = progress.requiredPassed === progress.requiredTotal;
  const failed = progress.failedSteps.length > 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-white p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-neutral-400" />
          <h3 className="text-sm font-bold text-neutral-900">
            Verification progress
          </h3>
        </div>
        <span className="text-xs font-bold text-neutral-500">
          {progress.requiredPassed} of {progress.requiredTotal} required levels
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            failed
              ? "bg-danger-500"
              : complete
                ? "bg-success-500"
                : "bg-warning-500",
          )}
          style={{ width: `${failed ? 100 : progress.percent}%` }}
        />
      </div>

      {/* A failed level rejects the account even when the level is optional —
          say so explicitly, or an admin sees REJECTED with every required
          level green and no explanation. */}
      {failed && (
        <div className="mt-3 flex gap-2 rounded-lg border border-danger-200 bg-danger-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger-600" />
          <p className="text-xs text-danger-700">
            <span className="font-bold">
              {progress.failedSteps.join(", ")} failed.
            </span>{" "}
            A failed check rejects the account regardless of whether the level
            is required. A successful retry of the same check clears it.
          </p>
        </div>
      )}

      {progress.manualOverride === "PASSED" && (
        <div className="mt-3 rounded-lg border border-brand-200 bg-brand-50 p-3 text-xs text-brand-700">
          <span className="font-bold">Manually approved by an admin.</span> The
          override stands even where automated levels are incomplete.
        </div>
      )}

      {!failed && !complete && progress.blockedBy.length > 0 && (
        <p className="mt-3 text-xs text-neutral-500">
          Waiting on:{" "}
          <span className="font-bold text-neutral-700">
            {progress.blockedBy.join(", ")}
          </span>
        </p>
      )}

      <ul className="mt-2 divide-y divide-neutral-100">
        {progress.steps.map((s) => (
          <StepRow key={s.key} step={s} />
        ))}
      </ul>
    </div>
  );
}
