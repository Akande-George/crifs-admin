"use client";

import { use, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { 
  ArrowLeft, Brain, ShieldCheck, TrendingUp, BarChart3, 
  Fingerprint, AlertCircle, CheckCircle2, ChevronRight, 
  FileText, Download, Share2, Info
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { formatPercent, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AIReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const aiReports = useMockStore((s) => s.aiReports);
  const fundingRequests = useMockStore((s) => s.fundingRequests);
  
  // The ID in the URL is the fundingRequestId for convenience
  const report = aiReports.find(r => r.fundingRequestId === id);
  const fr = fundingRequests.find(f => f.id === id);

  if (!report || !fr) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4"><Brain className="h-8 w-8 text-neutral-400" /></div>
        <h2 className="text-lg font-semibold text-neutral-900">AI Report not found</h2>
        <Link href="/ai-review" className="mt-4 text-sm text-brand-500 font-medium">← Back to dashboard</Link>
      </div>
    );
  }

  const sections = [
    { id: "documentQuality", label: "Document Quality", icon: Fingerprint, data: report.sections.documentQuality },
    { id: "historicalPatterns", label: "Historical Patterns", icon: TrendingUp, data: report.sections.historicalPatterns },
    { id: "cacCompliance", label: "Compliance Check", icon: ShieldCheck, data: report.sections.cacCompliance },
    { id: "financialSanity", label: "Financial Analysis", icon: BarChart3, data: report.sections.financialSanity },
    { id: "anomalyDetection", label: "Anomaly Detection", icon: AlertCircle, data: report.sections.anomalyDetection },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/ai-review" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-700 transition-colors"><ArrowLeft className="h-4 w-4" />AI Analysis</Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-medium truncate">{fr.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-4 flex items-center justify-center rounded-lg border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </button>
          <button className="h-9 px-4 flex items-center justify-center rounded-lg bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition-all active:scale-95">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      {/* Hero Score Card */}
      <div className="relative rounded-[2.5rem] bg-neutral-900 overflow-hidden p-10 text-white shadow-2xl shadow-brand-500/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-500/20 via-brand-accent/5 to-transparent pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-brand-500 font-black text-[10px] uppercase tracking-[0.2em]">
              Automated Analysis Report
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">{fr.companyName}</h1>
              <p className="text-xl text-neutral-400 mt-2 font-medium">{fr.title}</p>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Generated On</span>
                <span className="text-sm font-bold">{formatDate(report.generatedAt)}</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-6">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Engine Version</span>
                <span className="text-sm font-bold">{report.version}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="relative h-48 w-48 flex items-center justify-center">
              <svg className="h-48 w-48 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <motion.circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke={report.overallScore >= 80 ? "#22C55E" : report.overallScore >= 60 ? "#F59E0B" : "#EF4444"} 
                  strokeWidth="8" strokeLinecap="round" 
                  initial={{ strokeDasharray: "0 283" }}
                  animate={{ strokeDasharray: `${(report.overallScore / 100) * 283} 283` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span className="text-6xl font-black tracking-tighter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                  {report.overallScore}
                </motion.span>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest -mt-1">OVERALL</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Badge className={cn("px-4 py-1.5 text-xs font-bold uppercase tracking-widest", 
                report.overallScore >= 80 ? "bg-success-500 text-white" : 
                report.overallScore >= 60 ? "bg-warning-500 text-white" : "bg-danger-500 text-white")}>
                {report.overallScore >= 80 ? "Low" : report.overallScore >= 60 ? "Medium" : "High"} Risk Assessment
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <motion.div 
            key={section.id} 
            className="rounded-3xl border border-neutral-200 bg-surface overflow-hidden shadow-sm flex flex-col"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-400 group-hover:text-brand-500">
                  <section.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">{section.label}</h3>
              </div>
              <span className={cn("text-xs font-black px-3 py-1 rounded-full", 
                section.data.status === "LOW_RISK" ? "bg-success-50 text-success-600" : 
                section.data.status === "MEDIUM_RISK" ? "bg-warning-50 text-warning-600" : "bg-danger-50 text-danger-600")}>
                {section.data.score}%
              </span>
            </div>
            <div className="p-6 flex-1 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Key Findings</p>
                <ul className="space-y-2">
                  {section.data.findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600 leading-relaxed">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neutral-300 shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 mt-auto border-t border-neutral-50">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">AI Recommendation</p>
                <p className="text-sm font-medium text-neutral-900 leading-relaxed">{section.data.recommendation}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Recommendation Summary */}
        <motion.div 
          className="rounded-3xl bg-brand-500 p-8 text-white flex flex-col md:flex-row items-center gap-8 md:col-span-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center shrink-0">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2 flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold tracking-tight">Final AI Verdict</h3>
            <p className="text-brand-50 leading-relaxed max-w-2xl font-medium">
              Overall score of {report.overallScore}% indicates {report.overallScore >= 80 ? "very high" : report.overallScore >= 60 ? "moderate" : "guarded"} confidence. 
              The system recommends {report.overallScore >= 80 ? "immediate progression to disbursement." : report.overallScore >= 60 ? "proceeding with additional manual verification on historical patterns." : "immediate rejection due to severe document and financial sanity flags."}
            </p>
          </div>
          <button className="h-12 px-8 rounded-xl bg-white text-brand-600 font-bold hover:bg-neutral-100 transition-all active:scale-95 shadow-xl shadow-brand-600/10 whitespace-nowrap">
            Confirm & Proceed
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2", className)}>
      {children}
    </span>
  );
}
