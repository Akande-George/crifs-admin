"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminListings } from "@/lib/hooks/api/useAdmin";
import type { ListingStatus } from "@/lib/api/services/admin";
import { formatNaira, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: ListingStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const STATUS_STYLE: Record<ListingStatus, string> = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  PUBLISHED: "bg-success-50 text-success-600",
  CLOSED: "bg-flag-50 text-flag-600",
  CANCELLED: "bg-danger-50 text-danger-600",
};

const PER_PAGE = 15;

export default function MarketplacePage() {
  const [status, setStatus] = useState<ListingStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminListings({
    status: status === "ALL" ? undefined : status,
    q: search || undefined,
    page,
    perPage: PER_PAGE,
  });

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          Marketplace Listings
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage fundraising listings — publish drafts, monitor raises, close rounds.
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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
                  Listing
                </th>
                <th className="hidden sm:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Raised / Target
                </th>
                <th className="hidden lg:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((l) => {
                const target = Number(l.targetAmount);
                const raised = Number(l.raisedAmount);
                const pct = target > 0 ? Math.min(100, (raised / target) * 100) : 0;
                return (
                  <tr
                    key={l.id}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <Link href={`/marketplace/${l.id}`} className="block">
                        <p className="font-medium text-neutral-900 group-hover:text-brand-500 transition-colors">
                          {l.title}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {l._count?.investments ?? 0} investors
                        </p>
                      </Link>
                    </td>
                    <td className="hidden sm:table-cell py-3.5 px-4 text-neutral-700">
                      {l.company.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full",
                          STATUS_STYLE[l.status],
                        )}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-medium text-neutral-900">
                        {formatNaira(raised)}
                      </div>
                      <div className="text-xs text-neutral-400">
                        of {formatNaira(target)} ({pct.toFixed(0)}%)
                      </div>
                    </td>
                    <td className="hidden lg:table-cell py-3.5 px-4 text-neutral-500 text-sm">
                      {formatRelativeTime(l.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/marketplace/${l.id}`}
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
          No listings yet. Approve a funding request to create one.
        </div>
      )}
      {isError && (
        <div className="py-6 text-center text-sm text-danger-600">
          Failed to load listings.
        </div>
      )}
    </div>
  );
}
