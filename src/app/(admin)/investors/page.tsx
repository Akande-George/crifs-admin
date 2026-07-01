"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Users,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminUsers } from "@/lib/hooks/api/useAdmin";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatNaira, formatRelativeTime } from "@/lib/format";
import type { KycStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: KycStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Unverified", value: "UNVERIFIED" },
];

const PER_PAGE = 10;

export default function InvestorsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<KycStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminUsers({
    role: "INVESTOR",
    kycStatus: statusFilter === "ALL" ? undefined : statusFilter,
    q: search || undefined,
    page,
    perPage: PER_PAGE,
  });

  const investors = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalItems = meta?.totalItems ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Investors
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            All registered investors and their KYC status
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                statusFilter === f.value
                  ? "bg-brand-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <span className="text-xs text-neutral-400">
            {isLoading ? "…" : `${totalItems} investors`}
          </span>
        </div>
      </div>

      <motion.div
        className="rounded-xl border border-neutral-200 bg-surface overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50/80">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Investor
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  KYC
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {investors.map((inv) => {
                const initials = inv.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <motion.tr
                    key={inv.id}
                    className="group hover:bg-neutral-50/50 transition-colors"
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.12 }}
                  >
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/investors/${inv.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-500 font-semibold text-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 group-hover:text-brand-500 transition-colors">
                            {inv.name}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {inv.email}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={inv.kycStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-neutral-900">
                      {inv.wallet
                        ? formatNaira(Number(inv.wallet.available))
                        : "—"}
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-4 text-neutral-600 text-sm">
                      {formatRelativeTime(inv.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/investors/${inv.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
            <p className="text-xs text-neutral-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {!isLoading && !isError && investors.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4">
            <Users className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900">
            No investors found
          </h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-sm">
            {search
              ? `No investors match "${search}".`
              : "No investors match the selected filters."}
          </p>
        </motion.div>
      )}

      {isError && (
        <div className="text-sm text-danger-600 py-4 text-center">
          Failed to load investors. Try refreshing.
        </div>
      )}
    </div>
  );
}
