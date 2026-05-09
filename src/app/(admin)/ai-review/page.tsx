"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Brain, Search, Eye, Filter, TrendingUp, ShieldCheck, AlertCircle, BarChart3, Fingerprint, FileSearch } from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatNairaCompact, formatPercent, formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AIReviewPage() {
  const fundingRequests = useMockStore((s) => s.fundingRequests);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL");

  const reviewedRequests = useMemo(() => {
    // Only show requests that have an AI score
    let result = fundingRequests.filter(fr => fr.aiScore !== null);
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(fr => 
        fr.title.toLowerCase().includes(q) || fr.companyName.toLowerCase().includes(q)
      );
    }

    if (riskFilter !== "ALL") {
      result = result.filter(fr => {
        if (riskFilter === "LOW") return fr.aiScore! >= 80;
        if (riskFilter === "MEDIUM") return fr.aiScore! >= 60 && fr.aiScore! < 80;
        if (riskFilter === "HIGH") return fr.aiScore! < 60;
        return true;
      });
    }

    result.sort((a, b) => b.aiScore! - a.aiScore!);
    return result;
  }, [fundingRequests, search, riskFilter]);

  const avgScore = reviewedRequests.length 
    ? reviewedRequests.reduce((s, r) => s + r.aiScore!, 0) / reviewedRequests.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">AI Analysis Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Automated risk assessment and document verification reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Platform Score", value: `${Math.round(avgScore)}%`, icon: Brain, color: "text-brand-500 bg-brand-50" },
          { label: "High Risk Flags", value: reviewedRequests.filter(r => r.aiScore! < 60).length, icon: AlertCircle, color: "text-danger-500 bg-danger-50" },
          { label: "Verified Low Risk", value: reviewedRequests.filter(r => r.aiScore! >= 80).length, icon: ShieldCheck, color: "text-success-500 bg-success-50" },
          { label: "Total Reports", value: reviewedRequests.length, icon: FileSearch, color: "text-neutral-500 bg-neutral-50" },
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

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search reports..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all" />
        </div>
        <div className="flex items-center gap-2">
          {["ALL", "LOW", "MEDIUM", "HIGH"].map((r) => (
            <button key={r} onClick={() => setRiskFilter(r as any)}
              className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                riskFilter === r ? "bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/20" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
              )}>
              {r} RISK
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <motion.div className="rounded-2xl border border-neutral-200 bg-surface overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-100">
                    <th className="text-left py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Report Subject</th>
                    <th className="hidden sm:table-cell text-left py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Company</th>
                    <th className="text-center py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Score</th>
                    <th className="hidden md:table-cell text-center py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Risk Level</th>
                    <th className="text-center py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {reviewedRequests.map((fr) => (
                    <tr key={fr.id} className="group hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-neutral-900">{fr.title}</p>
                        <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-medium">Generated {formatDateShort(fr.reviewedAt || fr.createdAt)}</p>
                      </td>
                      <td className="hidden sm:table-cell py-4 px-6 text-neutral-600 font-medium">{fr.companyName}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn("text-lg font-black tracking-tighter",
                          fr.aiScore! >= 80 ? "text-success-600" : fr.aiScore! >= 60 ? "text-warning-600" : "text-danger-600"
                        )}>{fr.aiScore}%</span>
                      </td>
                      <td className="hidden md:table-cell py-4 px-6 text-center">
                        <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                          fr.aiScore! >= 80 ? "bg-success-50 text-success-600" : fr.aiScore! >= 60 ? "bg-warning-50 text-warning-600" : "bg-danger-50 text-danger-600"
                        )}>
                          {fr.aiScore! >= 80 ? "Low" : fr.aiScore! >= 60 ? "Medium" : "High"} Risk
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Link href={`/ai-review/${fr.id}`} className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div className="rounded-3xl bg-neutral-900 p-8 text-white space-y-6 shadow-xl shadow-neutral-900/10"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold tracking-tight">AI Verification Engine</h3>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Our proprietary engine analyzes thousands of data points including CAC filings, bank statements, and social media sentiment.
            </p>
            <div className="space-y-4 pt-4 border-t border-white/10">
              {[
                { label: "Document Quality", icon: Fingerprint },
                { label: "Compliance Check", icon: ShieldCheck },
                { label: "Pattern Detection", icon: TrendingUp },
                { label: "Financial Sanity", icon: BarChart3 },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <m.icon className="h-4 w-4 text-brand-500" />
                  <span className="text-sm font-medium text-neutral-300">{m.label}</span>
                  <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 w-[85%]" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest pt-4">CRIFS PRO ENGINE V2.4.0</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
