"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  ArrowUpRight, ArrowDownLeft, Search, 
  Download, Building2, TrendingUp, DollarSign
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { formatNaira, formatNairaCompact, formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";

const TX_TYPES = ["ALL", "DISBURSEMENT", "REPAYMENT", "PLATFORM_FEE"];

export default function FinancePage() {
  const transactions = useMockStore((s) => s.transactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.entityName.toLowerCase().includes(search.toLowerCase()) || 
                            tx.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "ALL" || tx.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  const stats = useMemo(() => {
    const totalDisbursed = transactions
      .filter(t => t.type === "DISBURSEMENT" && t.status === "COMPLETED")
      .reduce((s, t) => s + t.amount, 0);
    const totalRepaid = transactions
      .filter(t => t.type === "REPAYMENT" && t.status === "COMPLETED")
      .reduce((s, t) => s + t.amount, 0);
    const platformRevenue = transactions
      .filter(t => t.type === "PLATFORM_FEE" && t.status === "COMPLETED")
      .reduce((s, t) => s + t.amount, 0);
    
    return { totalDisbursed, totalRepaid, platformRevenue };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">Financial Ledger</h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">Track disbursements, repayments, and platform revenue</p>
        </div>
        <button className="h-10 px-4 rounded-lg bg-neutral-900 text-white text-xs md:text-sm font-bold hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-2 self-start sm:self-center">
          <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export Report</span><span className="sm:hidden">Export</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Total Disbursed", value: stats.totalDisbursed, icon: ArrowUpRight, color: "text-brand-500 bg-brand-50" },
          { label: "Total Repaid", value: stats.totalRepaid, icon: ArrowDownLeft, color: "text-success-500 bg-success-50" },
          { label: "Platform Revenue", value: stats.platformRevenue, icon: TrendingUp, color: "text-brand-accent bg-brand-accent/10" },
        ].map((stat) => (
          <motion.div key={stat.label} className="rounded-2xl border border-neutral-200 bg-surface p-5 md:p-6 space-y-4 shadow-sm"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className={cn("flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl", stat.color)}>
              <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-neutral-500 font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl md:text-2xl font-black text-neutral-900 mt-1">{formatNaira(stat.value)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all" />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {TX_TYPES.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn("px-3 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all whitespace-nowrap",
                typeFilter === t ? "bg-brand-500 text-white shadow-lg shadow-brand-500/10" : "bg-neutral-100 text-neutral-500 hover:text-neutral-700"
              )}>{t.replace("_", " ")}</button>
          ))}
        </div>
      </div>

      <motion.div className="rounded-2xl border border-neutral-200 bg-surface overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-100 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">
                <th className="py-4 px-4 md:px-6">Transaction</th>
                <th className="hidden lg:table-cell py-4 px-6">Entity</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 md:px-6 text-right">Amount</th>
                <th className="hidden sm:table-cell py-4 px-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((tx) => (
                <tr key={tx.id} className="group hover:bg-neutral-50/50 transition-colors">
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", 
                        tx.type === "DISBURSEMENT" ? "bg-brand-50 text-brand-500" : 
                        tx.type === "REPAYMENT" ? "bg-success-50 text-success-500" : "bg-neutral-100 text-neutral-500")}>
                        {tx.type === "DISBURSEMENT" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-neutral-900 text-xs md:text-sm truncate">{tx.description}</p>
                        <p className="text-[9px] md:text-[10px] text-neutral-400 mt-0.5 font-medium uppercase tracking-wider">{tx.type.replace("_", " ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3 w-3 text-neutral-400" />
                      <span className="font-medium text-neutral-700 text-sm">{tx.entityName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={cn("text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      tx.status === "COMPLETED" ? "bg-success-50 text-success-600" : 
                      tx.status === "PROCESSING" ? "bg-warning-50 text-warning-600" : "bg-neutral-100 text-neutral-500"
                    )}>{tx.status}</span>
                  </td>
                  <td className={cn("py-4 px-4 md:px-6 text-right font-bold text-xs md:text-sm", tx.type === "DISBURSEMENT" ? "text-neutral-900" : "text-success-600")}>
                    {tx.type === "DISBURSEMENT" ? "-" : "+"}{formatNaira(tx.amount)}
                  </td>
                  <td className="hidden sm:table-cell py-4 px-6 text-right text-neutral-400 text-[11px] font-medium">
                    {formatDateShort(tx.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 md:py-20 text-center text-neutral-400">
            <DollarSign className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 opacity-10" />
            <p className="font-medium text-sm">No transactions found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
