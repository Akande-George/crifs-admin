"use client";

import { useAnalytics } from "@/lib/hooks/api/useAdmin";
import { formatNaira } from "@/lib/format";

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return (
      <div className="py-24 text-center text-sm text-neutral-500">Loading…</div>
    );
  }
  if (isError || !data) {
    return (
      <div className="py-24 text-center text-sm text-danger-600">
        Failed to load analytics.
      </div>
    );
  }

  const t = data.totals;
  const m = data.money;

  const cards = [
    { label: "Investors", value: t.investors },
    { label: "Companies", value: `${t.companies} (${t.verifiedCompanies} verified)` },
    { label: "Published listings", value: t.publishedListings },
    { label: "Closed listings", value: t.closedListings },
    { label: "Committed", value: `${formatNaira(Number(m.committedAmount))} · ${m.committedCount}` },
    { label: "Settled to companies", value: `${formatNaira(Number(m.settledAmount))} · ${m.settledCount}` },
    { label: "Withdrawals paid", value: `${formatNaira(Number(m.completedWithdrawalsAmount))} · ${m.completedWithdrawalsCount}` },
    { label: "Processing withdrawals", value: t.pendingWithdrawals },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          Analytics
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Point-in-time aggregates across the platform.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-neutral-200 bg-surface p-4"
          >
            <p className="text-lg font-semibold text-neutral-900">{c.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-surface p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">
            Listings by status
          </h2>
          <div className="space-y-2">
            {data.listingsByStatus.map((r) => (
              <div
                key={r.status}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-neutral-600">{r.status}</span>
                <span className="font-medium text-neutral-900">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-surface p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">
            Investments by status
          </h2>
          <div className="space-y-2">
            {data.investmentsByStatus.map((r) => (
              <div
                key={r.status}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-neutral-600">{r.status}</span>
                <span className="font-medium text-neutral-900">
                  {formatNaira(Number(r.amount))} · {r.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
