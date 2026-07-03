"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Users,
  Building2,
  Store,
  Wallet,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  useAdminUsers,
  useAdminCompanies,
  useAdminListings,
  useAdminFundingRequests,
  useAdminWithdrawals,
} from "@/lib/hooks/api/useAdmin";
import { formatNaira, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  // Small page sizes — we only need meta.totalItems for counts + a few recent.
  const investors = useAdminUsers({ role: "INVESTOR", perPage: 1 });
  const companies = useAdminCompanies({ perPage: 1 });
  const verifiedCompanies = useAdminCompanies({
    kycStatus: "VERIFIED",
    perPage: 1,
  });
  const listings = useAdminListings({ status: "PUBLISHED", perPage: 5 });
  const pendingFunding = useAdminFundingRequests({
    status: "PENDING",
    perPage: 5,
  });
  const processingWithdrawals = useAdminWithdrawals({
    status: "PROCESSING",
    perPage: 1,
  });

  const totalRaised = (listings.data?.data ?? []).reduce(
    (s, l) => s + Number(l.raisedAmount),
    0,
  );

  const metrics = [
    {
      label: "Investors",
      value: investors.data?.meta.totalItems ?? "—",
      icon: Users,
      href: "/investors",
      tint: "text-brand-600 bg-brand-50",
    },
    {
      label: "Companies",
      value: companies.data?.meta.totalItems ?? "—",
      sub: `${verifiedCompanies.data?.meta.totalItems ?? 0} verified`,
      icon: Building2,
      href: "/companies",
      tint: "text-success-600 bg-success-50",
    },
    {
      label: "Published listings",
      value: listings.data?.meta.totalItems ?? "—",
      icon: Store,
      href: "/marketplace",
      tint: "text-flag-600 bg-flag-50",
    },
    {
      label: "Pending funding",
      value: pendingFunding.data?.meta.totalItems ?? "—",
      icon: FileText,
      href: "/funding",
      tint: "text-warning-600 bg-warning-50",
    },
    {
      label: "Processing withdrawals",
      value: processingWithdrawals.data?.meta.totalItems ?? "—",
      icon: Wallet,
      href: "/finance",
      tint: "text-danger-600 bg-danger-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Live snapshot across investors, companies, and the marketplace.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              href={m.href}
              className="block rounded-xl border border-neutral-200 bg-surface p-4 hover:border-brand-300 transition-colors"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center mb-3",
                  m.tint,
                )}
              >
                <m.icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-2xl font-semibold text-neutral-900">
                {m.value}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{m.label}</p>
              {m.sub && (
                <p className="text-[11px] text-neutral-400 mt-1">{m.sub}</p>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Total raised banner */}
      <div className="rounded-xl border border-neutral-200 bg-surface p-5">
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          Raised across published listings
        </p>
        <p className="text-3xl font-semibold text-brand-600 mt-1">
          {formatNaira(totalRaised)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending funding requests */}
        <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-neutral-900">
              Awaiting review
            </h2>
            <Link
              href="/funding"
              className="text-xs text-brand-500 hover:text-brand-600 inline-flex items-center gap-1"
            >
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {(pendingFunding.data?.data ?? []).length === 0 ? (
            <p className="text-sm text-neutral-400 p-6 text-center">
              Nothing pending.
            </p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {(pendingFunding.data?.data ?? []).map((fr) => (
                <Link
                  key={fr.id}
                  href={`/funding/${fr.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/50"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {fr.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {fr.company.name} · {formatRelativeTime(fr.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {formatNaira(Number(fr.targetAmount))}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent published listings */}
        <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-neutral-900">
              Live raises
            </h2>
            <Link
              href="/marketplace"
              className="text-xs text-brand-500 hover:text-brand-600 inline-flex items-center gap-1"
            >
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {(listings.data?.data ?? []).length === 0 ? (
            <p className="text-sm text-neutral-400 p-6 text-center">
              No live listings.
            </p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {(listings.data?.data ?? []).map((l) => {
                const t = Number(l.targetAmount);
                const r = Number(l.raisedAmount);
                const pct = t > 0 ? Math.min(100, (r / t) * 100) : 0;
                return (
                  <Link
                    key={l.id}
                    href={`/marketplace/${l.id}`}
                    className="block px-5 py-3 hover:bg-neutral-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-900">
                        {l.title}
                      </p>
                      <span className="text-xs text-neutral-500">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-1.5 bg-brand-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {formatNaira(r)} of {formatNaira(t)}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
