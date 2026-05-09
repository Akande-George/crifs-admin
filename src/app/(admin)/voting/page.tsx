"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Vote, Search, Eye, ChevronLeft, ChevronRight, ArrowUpDown, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatNairaCompact, formatPercent, formatDateShort } from "@/lib/format";
import type { VotingRoundStatus } from "@/lib/zod/voting";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: VotingRoundStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
];

export default function VotingPage() {
  const votingRounds = useMockStore((s) => s.votingRounds);
  const currentAdmin = useMockStore((s) => s.currentAdmin);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VotingRoundStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...votingRounds];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (vr) =>
          vr.requestTitle.toLowerCase().includes(q) ||
          vr.companyName.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "ALL") {
      result = result.filter((vr) => vr.status === statusFilter);
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [votingRounds, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Governance & Voting</h1>
          <p className="text-sm text-neutral-500 mt-1">Review funding proposals and cast your decision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Rounds", value: votingRounds.filter(r => r.status === "IN_PROGRESS").length, icon: Clock, color: "text-brand-500 bg-brand-50" },
          { label: "Your Pending Votes", value: votingRounds.filter(r => r.status === "IN_PROGRESS" && !r.votes.some(v => v.voterId === currentAdmin.id)).length, icon: Vote, color: "text-warning-500 bg-warning-50" },
          { label: "Completed Rounds", value: votingRounds.filter(r => r.status === "COMPLETED").length, icon: CheckCircle2, color: "text-success-500 bg-success-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-neutral-200 bg-surface p-4 flex items-center gap-4">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={cn("rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                statusFilter === f.value ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search proposals..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all" />
          </div>
        </div>
      </div>

      <motion.div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-100">
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Proposal</th>
                <th className="hidden lg:table-cell text-left py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Company</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                <th className="hidden md:table-cell text-left py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Participation</th>
                <th className="hidden sm:table-cell text-right py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Amount</th>
                <th className="hidden lg:table-cell text-center py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Result</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginated.map((vr) => {
                const hasVoted = vr.votes.some(v => v.voterId === currentAdmin.id);
                return (
                  <motion.tr key={vr.id} className="group hover:bg-neutral-50/50 transition-colors" whileHover={{ y: -1 }} transition={{ duration: 0.12 }}>
                    <td className="py-4 px-6">
                      <Link href={`/voting/${vr.id}`} className="block">
                        <p className="font-bold text-neutral-900 group-hover:text-brand-500 transition-colors">{vr.requestTitle}</p>
                        <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> Ends {formatDateShort(vr.endsAt)}
                        </p>
                      </Link>
                    </td>
                    <td className="hidden lg:table-cell py-4 px-6 font-medium text-neutral-600">{vr.companyName}</td>
                    <td className="py-4 px-6"><StatusBadge status={vr.status} /></td>
                    <td className="hidden md:table-cell py-4 px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500">
                          <span>{vr.votes.length}/{vr.requiredVotes} Votes</span>
                          <span>{formatPercent((vr.votes.length / vr.requiredVotes) * 100, 0)}</span>
                        </div>
                        <div className="h-1.5 w-24 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(vr.votes.length / vr.requiredVotes) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-4 px-6 text-right font-bold text-neutral-900">{formatNairaCompact(vr.amountRequested)}</td>
                    <td className="hidden lg:table-cell py-4 px-6 text-center">
                      {vr.status === "COMPLETED" ? (
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                          vr.result === "APPROVED" ? "bg-success-50 text-success-600" : "bg-danger-50 text-danger-600"
                        )}>{vr.result}</span>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">In Progress</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {vr.status === "IN_PROGRESS" && !hasVoted && (
                          <Link href={`/voting/${vr.id}`} className="h-8 px-3 flex items-center justify-center rounded-lg bg-brand-500 text-white text-[11px] font-bold hover:bg-brand-600 transition-colors">
                            Vote Now
                          </Link>
                        )}
                        {hasVoted && vr.status === "IN_PROGRESS" && (
                          <span className="text-[10px] font-bold text-success-600 uppercase tracking-widest">Voted</span>
                        )}
                        <Link href={`/voting/${vr.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
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
