"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Rocket,
  Lock,
  Ban,
} from "lucide-react";
import {
  useAdminListing,
  useAdminListingInvestments,
  usePublishListing,
  useCloseListing,
  useCancelListing,
} from "@/lib/hooks/api/useAdmin";
import type { ListingStatus } from "@/lib/api/services/admin";
import { formatNaira, formatDate } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<ListingStatus, string> = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  PUBLISHED: "bg-success-50 text-success-600",
  CLOSED: "bg-flag-50 text-flag-600",
  CANCELLED: "bg-danger-50 text-danger-600",
};

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: listing, isLoading } = useAdminListing(id);
  const { data: investmentsPage } = useAdminListingInvestments(id);
  const publish = usePublishListing();
  const close = useCloseListing();
  const cancel = useCancelListing();
  const toast = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-neutral-500">
        Loading…
      </div>
    );
  }
  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <h2 className="text-lg font-semibold text-neutral-900">
          Listing not found
        </h2>
        <Link
          href="/marketplace"
          className="text-sm text-brand-500 hover:text-brand-600 font-medium"
        >
          ← Back to marketplace
        </Link>
      </div>
    );
  }

  const target = Number(listing.targetAmount);
  const raised = Number(listing.raisedAmount);
  const pct = target > 0 ? Math.min(100, (raised / target) * 100) : 0;
  const investors = investmentsPage?.data ?? [];
  const busy = publish.isPending || close.isPending || cancel.isPending;

  const run = (
    fn: typeof publish,
    ok: string,
  ) =>
    fn.mutate(id, {
      onSuccess: () => toast.success(ok),
      onError: (e) =>
        toast.error(
          "Failed",
          (e as { message?: string })?.message ?? "Action failed",
        ),
    });

  return (
    <div className="space-y-6">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to marketplace
      </Link>

      <div className="rounded-2xl border border-neutral-200 bg-surface p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
              <Building2 className="h-4 w-4" /> {listing.company.name}
              <span className="text-neutral-300">·</span>
              {formatDate(listing.createdAt)}
            </div>
          </div>
          <span
            className={cn(
              "text-[11px] font-medium px-3 py-1 rounded-full",
              STATUS_STYLE[listing.status],
            )}
          >
            {listing.status}
          </span>
        </div>

        {/* Raise progress */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-neutral-900">
              {formatNaira(raised)}
            </span>
            <span className="text-neutral-500">
              of {formatNaira(target)} · {pct.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-brand-500 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5">
          <div>
            <p className="text-xs text-neutral-500">Min investment</p>
            <p className="text-sm font-semibold text-neutral-900">
              {formatNaira(Number(listing.minInvestment))}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Unit price</p>
            <p className="text-sm font-semibold text-neutral-900">
              {formatNaira(Number(listing.unitPrice))}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Closes</p>
            <p className="text-sm font-semibold text-neutral-900">
              {listing.closeAt ? formatDate(listing.closeAt) : "—"}
            </p>
          </div>
        </div>

        {/* Lifecycle actions */}
        <div className="flex items-center gap-3 mt-6 flex-wrap">
          {listing.status === "DRAFT" && (
            <button
              onClick={() => run(publish, "Listing published")}
              disabled={busy}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-success-500 text-white text-sm font-medium hover:bg-success-600 disabled:opacity-50 transition-colors"
            >
              <Rocket className="h-4 w-4" /> Publish
            </button>
          )}
          {listing.status === "PUBLISHED" && (
            <button
              onClick={() => run(close, "Listing closed")}
              disabled={busy}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-flag-500 text-white text-sm font-medium hover:bg-flag-600 disabled:opacity-50 transition-colors"
            >
              <Lock className="h-4 w-4" /> Close round
            </button>
          )}
          {(listing.status === "DRAFT" || listing.status === "PUBLISHED") && (
            <button
              onClick={() => run(cancel, "Listing cancelled")}
              disabled={busy}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-danger-500 text-white text-sm font-medium hover:bg-danger-600 disabled:opacity-50 transition-colors"
            >
              <Ban className="h-4 w-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-neutral-200 bg-surface p-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-2">
          Description
        </h2>
        <p className="text-sm text-neutral-600 leading-6 whitespace-pre-wrap">
          {listing.description}
        </p>
      </div>

      {/* Investors */}
      <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">
            Investors ({investors.length})
          </h2>
        </div>
        {investors.length === 0 ? (
          <p className="text-sm text-neutral-400 p-8 text-center">
            No commitments yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50/80">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Investor
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Committed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {investors.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 px-4">
                    <div className="font-medium text-neutral-800">
                      {inv.user.name}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {inv.user.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-neutral-900">
                    {formatNaira(Number(inv.amount))}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] text-neutral-600">
                      {inv.status}
                    </span>
                  </td>
                  <td className="hidden md:table-cell py-3 px-4 text-neutral-500 text-xs">
                    {formatDate(inv.committedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
