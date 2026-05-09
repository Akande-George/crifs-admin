"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Search, Shield, ChevronLeft, ChevronRight, Filter
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AuditPage() {
  const auditLog = useMockStore((s) => s.auditLog);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const filtered = useMemo(() => {
    return auditLog.filter(entry => {
      const q = search.toLowerCase();
      return (
        entry.action.toLowerCase().includes(q) ||
        entry.actorName.toLowerCase().includes(q) ||
        entry.entityName?.toLowerCase().includes(q) ||
        JSON.stringify(entry.metadata).toLowerCase().includes(q)
      );
    });
  }, [auditLog, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">System Audit Log</h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">Immutable record of all administrative actions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-50 text-success-700 text-[10px] md:text-xs font-bold border border-success-100 self-start sm:self-center">
          <Shield className="h-3 w-3 md:h-3.5 md:w-3.5" /> <span className="uppercase tracking-wider">Security Sealed</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search audit trail..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all" 
          />
        </div>
        <button className="h-10 px-4 rounded-lg border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      <motion.div 
        className="rounded-2xl border border-neutral-200 bg-surface overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] md:text-[13px] text-left">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-100 font-bold text-neutral-400 uppercase tracking-widest text-[9px] md:text-[10px]">
                <th className="py-4 px-4 md:px-6 whitespace-nowrap">Timestamp</th>
                <th className="py-4 px-4 md:px-6">Action</th>
                <th className="py-4 px-4 md:px-6">Actor</th>
                <th className="hidden lg:table-cell py-4 px-6">Entity</th>
                <th className="hidden sm:table-cell py-4 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {paginated.map((entry) => (
                <tr key={entry.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-4 px-4 md:px-6 whitespace-nowrap text-neutral-500 font-mono text-[10px] md:text-[11px]">
                    {formatDateTime(entry.timestamp)}
                  </td>
                  <td className="py-4 px-4 md:px-6">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-bold uppercase tracking-wider text-[9px] md:text-[10px] border border-neutral-200 whitespace-nowrap">
                      {entry.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex flex-col min-w-[120px]">
                      <span className="text-neutral-900 font-bold truncate">{entry.actorName}</span>
                      <span className="text-[9px] md:text-[10px] text-neutral-400 font-medium uppercase tracking-widest truncate">{entry.actorRole.replace(/_/g, " ")}</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell py-4 px-6">
                    {entry.entityName ? (
                      <div className="flex flex-col">
                        <span className="text-neutral-700">{entry.entityName}</span>
                        <span className="text-[9px] text-neutral-400 font-medium uppercase tracking-widest">{entry.entityType}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>
                  <td className="hidden sm:table-cell py-4 px-6">
                    <div className="max-w-xs truncate text-neutral-500 font-normal italic">
                      {entry.metadata ? JSON.stringify(entry.metadata) : "—"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-100 px-4 md:px-6 py-4 bg-neutral-50/30 gap-4">
            <p className="text-[10px] md:text-xs text-neutral-500 order-2 sm:order-1">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              <div className="flex items-center gap-1 px-2">
                <span className="text-xs font-bold text-neutral-900">{page}</span>
                <span className="text-xs text-neutral-400">/</span>
                <span className="text-xs text-neutral-400">{totalPages}</span>
              </div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
