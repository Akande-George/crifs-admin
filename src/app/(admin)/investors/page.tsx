"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Users, Search, Plus, Eye, ChevronLeft, ChevronRight, ArrowUpDown, Building2, User } from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatNairaCompact, formatRelativeTime } from "@/lib/format";
import type { AccreditationStatus, InvestorType } from "@/lib/zod/investor";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: AccreditationStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Accredited", value: "ACCREDITED" },
  { label: "Pending", value: "PENDING" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Expired", value: "EXPIRED" },
];

const TYPE_COLORS: Record<InvestorType, string> = {
  INDIVIDUAL: "bg-brand-50 text-brand-600",
  INSTITUTIONAL: "bg-success-50 text-success-600",
  CORPORATE: "bg-warning-50 text-warning-600",
};

export default function InvestorsPage() {
  const investors = useMockStore((s) => s.investors);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccreditationStatus | "ALL">("ALL");
  const [sortField, setSortField] = useState<"lastName" | "totalInvested" | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...investors];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (inv) =>
          `${inv.firstName} ${inv.lastName}`.toLowerCase().includes(q) ||
          inv.email.toLowerCase().includes(q) ||
          (inv.companyName?.toLowerCase().includes(q) ?? false) ||
          inv.state.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      result = result.filter((inv) => inv.accreditationStatus === statusFilter);
    }
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === "string" ? aVal.localeCompare(String(bVal)) : Number(aVal) - Number(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [investors, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: investors.length };
    for (const inv of investors) counts[inv.accreditationStatus] = (counts[inv.accreditationStatus] ?? 0) + 1;
    return counts;
  }, [investors]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Investors</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage investor profiles and accreditation</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors active:scale-[0.97]">
          <Plus className="h-4 w-4" /> Add Investor
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                statusFilter === f.value ? "bg-brand-500 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}>
              {f.label}
              <span className={cn("ml-0.5 text-[10px] rounded-full px-1.5 py-0.5",
                statusFilter === f.value ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-500"
              )}>{statusCounts[f.value] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search by name, email, company..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all" />
          </div>
          <span className="text-xs text-neutral-400">{filtered.length} investors</span>
        </div>
      </div>

      <motion.div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50/80">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-neutral-700" onClick={() => toggleSort("lastName")}>
                    Investor <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="hidden lg:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Location</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  <button className="flex items-center gap-1 ml-auto hover:text-neutral-700" onClick={() => toggleSort("totalInvested")}>
                    Invested <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="hidden lg:table-cell text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Portfolio</th>
                <th className="hidden sm:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Active</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginated.map((inv) => (
                <motion.tr key={inv.id} className="group hover:bg-neutral-50/50 transition-colors" whileHover={{ y: -1 }} transition={{ duration: 0.12 }}>
                  <td className="py-3.5 px-4">
                    <Link href={`/investors/${inv.id}`} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-500 font-semibold text-xs shrink-0">
                        {inv.firstName[0]}{inv.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 group-hover:text-brand-500 transition-colors">
                          {inv.firstName} {inv.lastName}
                        </p>
                        <p className="text-xs text-neutral-400">{inv.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="hidden lg:table-cell py-3.5 px-4">
                    <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", TYPE_COLORS[inv.type])}>
                      {inv.type === "INDIVIDUAL" ? "Individual" : inv.type === "INSTITUTIONAL" ? "Institutional" : "Corporate"}
                    </span>
                  </td>
                  <td className="hidden md:table-cell py-3.5 px-4 text-neutral-600 text-sm">{inv.city}, {inv.state}</td>
                  <td className="py-3.5 px-4"><StatusBadge status={inv.accreditationStatus} /></td>
                  <td className="py-3.5 px-4 text-right font-medium text-neutral-900">{formatNairaCompact(inv.totalInvested)}</td>
                  <td className="hidden lg:table-cell py-3.5 px-4 text-right text-neutral-600">{formatNairaCompact(inv.portfolioValue)}</td>
                  <td className="hidden sm:table-cell py-3.5 px-4 text-neutral-600">{inv.activeInvestments}</td>
                  <td className="py-3.5 px-4 text-center">
                    <Link href={`/investors/${inv.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
            <p className="text-xs text-neutral-500">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                    p === page ? "bg-brand-500 text-white" : "text-neutral-500 hover:bg-neutral-100")}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div className="flex flex-col items-center justify-center py-16 text-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4"><Users className="h-8 w-8 text-neutral-400" /></div>
          <h3 className="text-sm font-semibold text-neutral-900">No investors found</h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-sm">
            {search ? `No investors match "${search}".` : "No investors match the selected filters."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
