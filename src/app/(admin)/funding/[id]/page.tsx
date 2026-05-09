"use client";

import { use, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Wallet, Building2, Calendar, Clock, User, CheckCircle2, XCircle, DollarSign, Brain, FileText, BarChart3 } from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { RoleGuardedAction } from "@/components/organisms/RoleGuardedAction";
import { formatNaira, formatNairaCompact, formatDate, formatRelativeTime, formatPercent } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import { approveFunding, rejectFunding } from "@/lib/mock/handlers/funding";
import { cn } from "@/lib/utils";

const STAGE_ORDER = ["APPLICATION", "DOCUMENT_REVIEW", "AI_ANALYSIS", "COMMITTEE_REVIEW", "APPROVED", "DISBURSEMENT", "ACTIVE", "COMPLETED"];

export default function FundingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fundingRequests = useMockStore((s) => s.fundingRequests);
  const fr = fundingRequests.find((f) => f.id === id);
  const [isActioning, setIsActioning] = useState(false);
  const toast = useToast();

  if (!fr) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4"><Wallet className="h-8 w-8 text-neutral-400" /></div>
        <h2 className="text-lg font-semibold text-neutral-900">Funding request not found</h2>
        <Link href="/funding" className="mt-4 text-sm text-brand-500 font-medium">← Back to funding</Link>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsActioning(true);
    const result = await approveFunding(fr.id);
    setIsActioning(false);
    if (result.ok) toast.success("Funding approved", `${fr.title} has been approved`);
    else toast.error("Failed", result.error);
  };

  const handleReject = async () => {
    setIsActioning(true);
    const result = await rejectFunding(fr.id, "Does not meet criteria");
    setIsActioning(false);
    if (result.ok) toast.success("Funding rejected", `${fr.title} has been rejected`);
    else toast.error("Failed", result.error);
  };

  const currentStageIdx = STAGE_ORDER.indexOf(fr.stage);
  const disbursementPct = fr.amountApproved ? (fr.amountDisbursed / fr.amountApproved) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/funding" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-700 transition-colors"><ArrowLeft className="h-4 w-4" />Funding</Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-medium truncate">{fr.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-neutral-900">{fr.title}</h1>
            <StatusBadge status={fr.stage} size="md" />
          </div>
          <p className="text-sm text-neutral-500 mt-1">{fr.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{fr.companyName}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Submitted {formatDate(fr.submittedAt)}</span>
            {fr.assignedOfficer && <span className="flex items-center gap-1"><User className="h-3 w-3" />{fr.assignedOfficer}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {["COMMITTEE_REVIEW", "AI_ANALYSIS", "DOCUMENT_REVIEW"].includes(fr.stage) && (
            <>
              <RoleGuardedAction action="funding:approve">
                <button onClick={handleApprove} disabled={isActioning}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg bg-success-500 text-white text-sm font-medium hover:bg-success-600 transition-colors disabled:opacity-50 active:scale-[0.97]">
                  <CheckCircle2 className="h-4 w-4" />Approve
                </button>
              </RoleGuardedAction>
              <RoleGuardedAction action="funding:approve">
                <button onClick={handleReject} disabled={isActioning}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg bg-danger-50 text-danger-600 text-sm font-medium hover:bg-danger-100 transition-colors disabled:opacity-50 active:scale-[0.97]">
                  <XCircle className="h-4 w-4" />Reject
                </button>
              </RoleGuardedAction>
            </>
          )}
        </div>
      </div>

      {/* Pipeline Progress */}
      <motion.div className="rounded-xl border border-neutral-200 bg-surface p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Pipeline Progress</h3>
        <div className="flex items-center gap-0">
          {STAGE_ORDER.map((stage, i) => {
            const isComplete = i < currentStageIdx;
            const isCurrent = i === currentStageIdx;
            return (
              <div key={stage} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={cn("h-4 w-4 rounded-full border-2 transition-all",
                    isComplete ? "bg-success-500 border-success-500" :
                    isCurrent ? "bg-brand-500 border-brand-500 ring-4 ring-brand-500/20" :
                    "bg-white border-neutral-300")} />
                  <span className={cn("text-[9px] text-center leading-tight",
                    isCurrent ? "text-brand-600 font-medium" : isComplete ? "text-success-600" : "text-neutral-400"
                  )}>{stage.replace(/_/g, " ").slice(0, 10)}</span>
                </div>
                {i < STAGE_ORDER.length - 1 && (
                  <div className={cn("h-0.5 flex-1 -mt-4", isComplete ? "bg-success-500" : "bg-neutral-200")} />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Summary */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {[
              { label: "Requested", value: formatNaira(fr.amountRequested), color: "text-neutral-900" },
              { label: "Approved", value: fr.amountApproved ? formatNaira(fr.amountApproved) : "Pending", color: fr.amountApproved ? "text-success-600" : "text-neutral-400" },
              { label: "Disbursed", value: fr.amountDisbursed > 0 ? formatNaira(fr.amountDisbursed) : "—", color: fr.amountDisbursed > 0 ? "text-brand-600" : "text-neutral-400" },
              { label: "Risk Score", value: fr.riskScore !== null ? `${fr.riskScore}%` : "N/A", color: fr.riskScore !== null && fr.riskScore <= 25 ? "text-success-600" : fr.riskScore !== null && fr.riskScore <= 50 ? "text-warning-600" : "text-neutral-900" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-neutral-200 bg-surface p-4">
                <p className="text-xs text-neutral-500">{m.label}</p>
                <p className={cn("text-lg font-semibold mt-1", m.color)}>{m.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Use of Funds */}
          <motion.div className="rounded-xl border border-neutral-200 bg-surface p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Use of Funds</h3>
            <div className="space-y-3">
              {fr.useOfFunds.map((category) => (
                <div key={category.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 text-xs">{category.percentage}%</span>
                      <span className="font-medium text-neutral-900">{formatNairaCompact(category.amount)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-brand-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-900">Total</span>
              <span className="font-semibold text-neutral-900">{formatNaira(fr.amountRequested)}</span>
            </div>
          </motion.div>

          {/* Disbursement Progress */}
          {fr.amountApproved && fr.amountApproved > 0 && (
            <motion.div className="rounded-xl border border-neutral-200 bg-surface p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Disbursement Progress</h3>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-neutral-500">{formatNairaCompact(fr.amountDisbursed)} of {formatNairaCompact(fr.amountApproved)}</span>
                <span className="font-medium text-brand-600">{formatPercent(disbursementPct, 0)}</span>
              </div>
              <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-brand-500 to-brand-accent rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${disbursementPct}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 1, 0.5, 1] }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div className="rounded-xl border border-neutral-200 bg-surface p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Details</h3>
            <div className="space-y-3">
              {[
                { label: "Company", value: fr.companyName },
                { label: "Tenure", value: fr.tenure ? `${fr.tenure} months` : "—" },
                { label: "Interest Rate", value: fr.interestRate ? `${fr.interestRate}%` : "—" },
                { label: "AI Score", value: fr.aiScore !== null ? `${fr.aiScore}%` : "Pending" },
                { label: "Submitted", value: formatDate(fr.submittedAt) },
                { label: "Reviewed", value: fr.reviewedAt ? formatDate(fr.reviewedAt) : "—" },
                { label: "Approved", value: fr.approvedAt ? formatDate(fr.approvedAt) : "—" },
                { label: "Disbursed", value: fr.disbursedAt ? formatDate(fr.disbursedAt) : "—" },
              ].map((d) => (
                <div key={d.label} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">{d.label}</span>
                  <span className="font-medium text-neutral-900">{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Score Ring */}
          {fr.aiScore !== null && (
            <motion.div className="rounded-xl border border-neutral-200 bg-surface p-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">AI Assessment</h3>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="#F3F4F6" strokeWidth="6" />
                    <circle cx="40" cy="40" r="36" fill="none"
                      stroke={fr.aiScore >= 80 ? "#22C55E" : fr.aiScore >= 60 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(fr.aiScore / 100) * 226} 226`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-neutral-900">{fr.aiScore}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {fr.aiScore >= 80 ? "Strong" : fr.aiScore >= 60 ? "Moderate" : "Weak"}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">Based on financial analysis and risk assessment</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
