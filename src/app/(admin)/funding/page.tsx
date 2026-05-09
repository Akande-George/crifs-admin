"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Wallet, Search, Eye, ChevronLeft, ChevronRight, ArrowUpDown, Building2, ArrowRight } from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatNairaCompact, formatRelativeTime } from "@/lib/format";
import type { PipelineStage } from "@/lib/zod/funding";
import { cn } from "@/lib/utils";

const STAGE_ORDER: PipelineStage[] = ["APPLICATION", "DOCUMENT_REVIEW", "AI_ANALYSIS", "COMMITTEE_REVIEW", "APPROVED", "DISBURSEMENT", "ACTIVE", "COMPLETED", "REJECTED"];
const STAGE_COLORS: Record<PipelineStage, string> = {
  APPLICATION: "bg-neutral-400", DOCUMENT_REVIEW: "bg-flag-500", AI_ANALYSIS: "bg-brand-500",
  COMMITTEE_REVIEW: "bg-warning-500", APPROVED: "bg-success-500", DISBURSEMENT: "bg-brand-accent",
  ACTIVE: "bg-success-600", COMPLETED: "bg-success-700", REJECTED: "bg-danger-500",
};

export default function FundingPage() {
  const fundingRequests = useMockStore((s) => s.fundingRequests);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<PipelineStage | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...fundingRequests];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((fr) =>
        fr.title.toLowerCase().includes(q) || fr.companyName.toLowerCase().includes(q)
      );
    }
    if (stageFilter !== "ALL") result = result.filter((fr) => fr.stage === stageFilter);
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [fundingRequests, search, stageFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: fundingRequests.length };
    for (const fr of fundingRequests) counts[fr.stage] = (counts[fr.stage] ?? 0) + 1;
    return counts;
  }, [fundingRequests]);

  // Pipeline summary
  const pipelineSummary = STAGE_ORDER.filter((s) => s !== "REJECTED").map((stage) => ({
    stage,
    count: stageCounts[stage] ?? 0,
    color: STAGE_COLORS[stage],
  }));

  const totalAmount = fundingRequests.reduce((s, fr) => s + fr.amountRequested, 0);
  const disbursedAmount = fundingRequests.reduce((s, fr) => s + fr.amountDisbursed, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Funding Requests</h1>
          <p className="text-sm text-neutral-500 mt-1">Review and manage funding pipeline</p>
        </div>
      </div>

      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div className="rounded-xl border border-neutral-200 bg-surface p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="text-xs text-neutral-500">Total Requests</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{fundingRequests.length}</p>
        </motion.div>
        <motion.div className="rounded-xl border border-neutral-200 bg-surface p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-xs text-neutral-500">Total Requested</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{formatNairaCompact(totalAmount)}</p>
        </motion.div>
        <motion.div className="rounded-xl border border-neutral-200 bg-surface p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="text-xs text-neutral-500">Total Disbursed</p>
          <p className="text-2xl font-semibold text-success-600 mt-1">{formatNairaCompact(disbursedAmount)}</p>
        </motion.div>
        <motion.div className="rounded-xl border border-neutral-200 bg-surface p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-xs text-neutral-500">In Pipeline</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">
            {fundingRequests.filter((fr) => !["COMPLETED", "REJECTED"].includes(fr.stage)).length}
          </p>
        </motion.div>
      </div>

      {/* Visual Pipeline */}
      <motion.div className="rounded-xl border border-neutral-200 bg-surface p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Pipeline Overview</h2>
        <div className="flex items-center gap-1 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
          {pipelineSummary.map((item, i) => (
            <div key={item.stage} className="flex items-center gap-1 min-w-[120px] sm:min-w-0 sm:flex-1">
              <button
                onClick={() => { setStageFilter(stageFilter === item.stage ? "ALL" : item.stage); setPage(1); }}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-lg flex-1 transition-all cursor-pointer",
                  stageFilter === item.stage ? "bg-brand-50 ring-1 ring-brand-500" : "hover:bg-neutral-50"
                )}
              >
                <div className={cn("h-3 w-3 rounded-full", item.color)} />
                <span className="text-[10px] text-neutral-500 text-center leading-tight">
                  {item.stage.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace("Ai", "AI")}
                </span>
                <span className="text-sm font-semibold text-neutral-900">{item.count}</span>
              </button>
              {i < pipelineSummary.length - 1 && <ArrowRight className="h-3 w-3 text-neutral-300 shrink-0" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search by title or company..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all" />
        </div>
        {stageFilter !== "ALL" && (
          <button onClick={() => setStageFilter("ALL")} className="text-xs text-brand-500 hover:text-brand-600 font-medium">
            Clear filter
          </button>
        )}
        <span className="text-xs text-neutral-400">{filtered.length} requests</span>
      </div>

      {/* Table */}
      <motion.div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50/80">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Request</th>
                <th className="hidden sm:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Company</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Stage</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Requested</th>
                <th className="hidden lg:table-cell text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Disbursed</th>
                <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">AI Score</th>
                <th className="hidden xl:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Officer</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginated.map((fr) => (
                <motion.tr key={fr.id} className="group hover:bg-neutral-50/50 transition-colors" whileHover={{ y: -1 }} transition={{ duration: 0.12 }}>
                  <td className="py-3.5 px-4">
                    <Link href={`/funding/${fr.id}`} className="block">
                      <p className="font-medium text-neutral-900 group-hover:text-brand-500 transition-colors">{fr.title}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{fr.milestone}</p>
                    </Link>
                  </td>
                  <td className="hidden sm:table-cell py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-500 font-semibold text-[10px]">
                        {fr.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-neutral-700 text-sm">{fr.companyName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4"><StatusBadge status={fr.stage} /></td>
                  <td className="py-3.5 px-4 text-right font-medium text-neutral-900">{formatNairaCompact(fr.amountRequested)}</td>
                  <td className="hidden lg:table-cell py-3.5 px-4 text-right text-neutral-600">
                    {fr.amountDisbursed > 0 ? formatNairaCompact(fr.amountDisbursed) : "—"}
                  </td>
                  <td className="hidden md:table-cell py-3.5 px-4">
                    {fr.aiScore !== null ? (
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                        fr.aiScore >= 80 ? "bg-success-50 text-success-600" :
                        fr.aiScore >= 60 ? "bg-warning-50 text-warning-600" : "bg-danger-50 text-danger-600"
                      )}>{fr.aiScore}%</span>
                    ) : <span className="text-xs text-neutral-400">—</span>}
                  </td>
                  <td className="hidden xl:table-cell py-3.5 px-4 text-neutral-600 text-sm">{fr.assignedOfficer ?? "Unassigned"}</td>
                  <td className="py-3.5 px-4 text-center">
                    <Link href={`/funding/${fr.id}`}
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
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors", p === page ? "bg-brand-500 text-white" : "text-neutral-500 hover:bg-neutral-100")}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
