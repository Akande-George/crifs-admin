"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminWithdrawals } from "@/lib/hooks/api/useAdmin";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatNaira, formatRelativeTime } from "@/lib/format";
import type { WithdrawalStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: WithdrawalStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
  { label: "Pending OTP", value: "PENDING_OTP" },
  { label: "Cancelled", value: "CANCELLED" },
];

const PER_PAGE = 20;

export default function FinancePage() {
  const [statusFilter, setStatusFilter] =
    useState<WithdrawalStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminWithdrawals({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    perPage: PER_PAGE,
  });

  const withdrawals = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalItems = meta?.totalItems ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          Withdrawals
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          All user withdrawals and their settlement status
        </p>
      </div>

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
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-2 text-xs text-neutral-400">
          {isLoading ? "…" : `${totalItems} withdrawals`}
        </span>
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
                  User
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="hidden md:table-cell text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Net
                </th>
                <th className="hidden lg:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Bank
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-neutral-50/50">
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-medium text-neutral-900">
                        {w.user.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {w.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-neutral-900 tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <ArrowUpRight className="h-3.5 w-3.5 text-danger-500" />
                      {formatNaira(Number(w.amount))}
                    </span>
                  </td>
                  <td className="hidden md:table-cell py-3.5 px-4 text-right text-neutral-600 tabular-nums">
                    {formatNaira(Number(w.net))}
                  </td>
                  <td className="hidden lg:table-cell py-3.5 px-4 text-neutral-600">
                    <div className="text-xs">{w.bankAccount.bankName}</div>
                    <div className="text-xs text-neutral-400 tabular-nums">
                      {w.bankAccount.accountNumber}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={w.status} />
                    {w.failureReason && (
                      <p className="text-[11px] text-danger-600 mt-1 max-w-[220px]">
                        {w.failureReason}
                      </p>
                    )}
                  </td>
                  <td className="hidden md:table-cell py-3.5 px-4 text-neutral-600 text-sm">
                    {formatRelativeTime(w.createdAt)}
                  </td>
                </tr>
              ))}
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

      {!isLoading && !isError && withdrawals.length === 0 && (
        <div className="py-16 text-center text-sm text-neutral-500">
          No withdrawals match this filter.
        </div>
      )}

      {isError && (
        <div className="text-sm text-danger-600 py-4 text-center">
          Failed to load withdrawals. Try refreshing.
        </div>
      )}
    </div>
  );
}
