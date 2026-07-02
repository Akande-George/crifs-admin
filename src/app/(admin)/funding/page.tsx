"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminFundingRequests } from "@/lib/hooks/api/useAdmin";
import type { FundingRequestStatus } from "@/lib/api/services/admin";
import { formatNaira, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: FundingRequestStatus | "ALL" }[] =
  [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

const STATUS_STYLE: Record<
  FundingRequestStatus,
  { bg: string; text: string }
> = {
  PENDING: { bg: "bg-warning-50", text: "text-warning-600" },
  APPROVED: { bg: "bg-success-50", text: "text-success-600" },
  REJECTED: { bg: "bg-danger-50", text: "text-danger-600" },
};

const AI_FALLBACK = {
  bg: "bg-neutral-100",
  text: "text-neutral-500",
  label: "Queued",
};
const AI_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: AI_FALLBACK,
  RUNNING: { bg: "bg-brand-50", text: "text-brand-600", label: "Analysing…" },
  COMPLETE: { bg: "bg-success-50", text: "text-success-600", label: "Ready" },
  FAILED: { bg: "bg-danger-50", text: "text-danger-600", label: "Failed" },
};

const PER_PAGE = 15;

export default function FundingPage() {
  const [status, setStatus] = useState<FundingRequestStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useAdminFundingRequests({
    status: status === "ALL" ? undefined : status,
    page,
    perPage: PER_PAGE,
  });

  const rows = (data?.data ?? []).filter((r) =>
    search
      ? r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.company.name.toLowerCase().includes(search.toLowerCase())
      : true,
  );
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          Funding Requests
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Review company raise proposals. Approving creates a draft listing.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              status === f.value
                ? "bg-brand-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search title or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>
      </div>

      <motion.div
        className="rounded-xl border border-neutral-200 bg-surface overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50/80">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="hidden sm:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  AI Review
                </th>
                <th className="hidden lg:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((fr) => {
                const s = STATUS_STYLE[fr.status];
                const ai = AI_STYLE[fr.aiStatus] ?? AI_FALLBACK;
                return (
                  <tr
                    key={fr.id}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <Link href={`/funding/${fr.id}`} className="block">
                        <p className="font-medium text-neutral-900 group-hover:text-brand-500 transition-colors">
                          {fr.title}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          min {formatNaira(Number(fr.minInvestment))}
                        </p>
                      </Link>
                    </td>
                    <td className="hidden sm:table-cell py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-500 font-semibold text-[10px]">
                          {fr.company.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-neutral-700 text-sm">
                          {fr.company.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-neutral-900">
                      {formatNaira(Number(fr.targetAmount))}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full",
                          s.bg,
                          s.text,
                        )}
                      >
                        {fr.status}
                      </span>
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-4">
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full",
                          ai.bg,
                          ai.text,
                        )}
                      >
                        {ai.label}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell py-3.5 px-4 text-neutral-500 text-sm">
                      {formatRelativeTime(fr.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/funding/${fr.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
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

      {!isLoading && !isError && rows.length === 0 && (
        <div className="py-16 text-center text-sm text-neutral-500">
          No funding requests {status !== "ALL" ? `(${status.toLowerCase()})` : ""} yet.
        </div>
      )}
      {isError && (
        <div className="py-6 text-center text-sm text-danger-600">
          Failed to load funding requests.
        </div>
      )}
    </div>
  );
}
