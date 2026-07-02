"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Brain,
  RefreshCw,
} from "lucide-react";
import {
  useAdminFundingRequests,
  useApproveFundingRequest,
  useRejectFundingRequest,
  useRerunFundingAi,
} from "@/lib/hooks/api/useAdmin";
import { formatNaira, formatDate } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-warning-50 text-warning-600",
  APPROVED: "bg-success-50 text-success-600",
  REJECTED: "bg-danger-50 text-danger-600",
};
const AI_FALLBACK = { cls: "bg-neutral-100 text-neutral-500", label: "Queued" };
const AI_STYLE: Record<string, { cls: string; label: string }> = {
  PENDING: AI_FALLBACK,
  RUNNING: { cls: "bg-brand-50 text-brand-600", label: "Analysing…" },
  COMPLETE: { cls: "bg-success-50 text-success-600", label: "Ready" },
  FAILED: { cls: "bg-danger-50 text-danger-600", label: "Failed" },
};

export default function FundingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  // Funding requests are low-volume; pull the list (which carries aiAnalysis
  // + polls while AI runs) and find this one. Avoids a separate detail endpoint.
  const { data, isLoading } = useAdminFundingRequests({ perPage: 100 });
  const fr = useMemo(() => data?.data.find((r) => r.id === id), [data, id]);

  const approve = useApproveFundingRequest();
  const reject = useRejectFundingRequest();
  const rerun = useRerunFundingAi();
  const toast = useToast();
  const [notes, setNotes] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-neutral-500">
        Loading…
      </div>
    );
  }
  if (!fr) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <h2 className="text-lg font-semibold text-neutral-900">
          Request not found
        </h2>
        <Link
          href="/funding"
          className="text-sm text-brand-500 hover:text-brand-600 font-medium"
        >
          ← Back to funding
        </Link>
      </div>
    );
  }

  const canReview = fr.status === "PENDING";
  const ai = AI_STYLE[fr.aiStatus] ?? AI_FALLBACK;
  const busy = approve.isPending || reject.isPending;

  const onApprove = async () => {
    try {
      const res = await approve.mutateAsync({
        id: fr.id,
        notes: notes || undefined,
      });
      toast.success(
        "Approved",
        `Draft listing created (${res.listing.id.slice(-6)}). Publish it from Marketplace.`,
      );
    } catch (e) {
      toast.error(
        "Failed",
        (e as { message?: string })?.message ?? "Could not approve",
      );
    }
  };
  const onReject = async () => {
    try {
      await reject.mutateAsync({ id: fr.id, notes: notes || undefined });
      toast.success("Rejected", "The company will see your note.");
    } catch (e) {
      toast.error(
        "Failed",
        (e as { message?: string })?.message ?? "Could not reject",
      );
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/funding"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to funding
      </Link>

      <div className="rounded-2xl border border-neutral-200 bg-surface p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
              {fr.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
              <Building2 className="h-4 w-4" /> {fr.company.name}
              <span className="text-neutral-300">·</span>
              {formatDate(fr.createdAt)}
            </div>
          </div>
          <span
            className={cn(
              "text-[11px] font-medium px-3 py-1 rounded-full",
              STATUS_STYLE[fr.status],
            )}
          >
            {fr.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5">
          <div>
            <p className="text-xs text-neutral-500">Target</p>
            <p className="text-lg font-semibold text-neutral-900">
              {formatNaira(Number(fr.targetAmount))}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Min investment</p>
            <p className="text-lg font-semibold text-neutral-900">
              {formatNaira(Number(fr.minInvestment))}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Unit price</p>
            <p className="text-lg font-semibold text-neutral-900">
              {formatNaira(Number(fr.unitPrice))}
            </p>
          </div>
        </div>

        {canReview && (
          <div className="mt-6 space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Review notes (optional — shown to the company)…"
              rows={2}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={onApprove}
                disabled={busy}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-success-500 text-white text-sm font-medium hover:bg-success-600 disabled:opacity-50 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve → create listing
              </button>
              <button
                onClick={onReject}
                disabled={busy}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-danger-500 text-white text-sm font-medium hover:bg-danger-600 disabled:opacity-50 transition-colors"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
            </div>
          </div>
        )}

        {fr.status === "APPROVED" && fr.linkedListingId && (
          <Link
            href={`/marketplace/${fr.linkedListingId}`}
            className="inline-flex items-center gap-1.5 mt-5 text-sm text-brand-500 hover:text-brand-600 font-medium"
          >
            View created listing →
          </Link>
        )}
        {fr.reviewNotes && (
          <p className="mt-4 text-sm text-neutral-600">
            <span className="font-medium">Review note:</span> {fr.reviewNotes}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-surface p-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-2">
          Description
        </h2>
        <p className="text-sm text-neutral-600 leading-6 whitespace-pre-wrap">
          {fr.description}
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-surface p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-brand-500" />
            <h2 className="text-sm font-semibold text-neutral-900">
              AI Risk Analysis
            </h2>
            <span
              className={cn(
                "text-[11px] font-medium px-2 py-0.5 rounded-full",
                ai.cls,
              )}
            >
              {ai.label}
            </span>
          </div>
          <button
            onClick={() =>
              rerun.mutate(fr.id, {
                onSuccess: () => toast.success("Re-run queued"),
                onError: () => toast.error("Failed to queue re-run"),
              })
            }
            disabled={rerun.isPending || fr.aiStatus === "RUNNING"}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 disabled:opacity-40"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", rerun.isPending && "animate-spin")}
            />
            Re-run
          </button>
        </div>

        {fr.aiStatus === "COMPLETE" && fr.aiAnalysis ? (
          <p className="text-sm text-neutral-700 leading-6 whitespace-pre-wrap">
            {fr.aiAnalysis}
          </p>
        ) : fr.aiStatus === "FAILED" ? (
          <p className="text-sm text-danger-600">
            {fr.aiError ?? "Analysis failed. Try re-running."}
          </p>
        ) : (
          <p className="text-sm text-neutral-500">
            {fr.aiStatus === "RUNNING"
              ? "Analysis in progress — this refreshes automatically."
              : "Queued for analysis."}
          </p>
        )}
      </div>
    </div>
  );
}
