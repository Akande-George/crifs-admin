"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Users, Phone, Mail, Building2, MapPin, Calendar, Wallet, TrendingUp, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { RoleGuardedAction } from "@/components/organisms/RoleGuardedAction";
import { formatNaira, formatNairaCompact, formatDate, formatRelativeTime, formatPhoneNumber, formatPercent } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import { approveAccreditation, rejectAccreditation } from "@/lib/mock/handlers/investors";
import { cn } from "@/lib/utils";

const TYPE_LABELS = { INDIVIDUAL: "Individual", INSTITUTIONAL: "Institutional", CORPORATE: "Corporate" } as const;
const RISK_LABELS = { CONSERVATIVE: "Conservative", MODERATE: "Moderate", AGGRESSIVE: "Aggressive" } as const;
const RISK_COLORS = { CONSERVATIVE: "text-success-600 bg-success-50", MODERATE: "text-warning-600 bg-warning-50", AGGRESSIVE: "text-danger-600 bg-danger-50" } as const;

const TABS = [
  { id: "overview", label: "Overview", icon: Users },
  { id: "investments", label: "Investments", icon: Wallet },
  { id: "documents", label: "Documents", icon: ShieldCheck },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function InvestorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const investors = useMockStore((s) => s.investors);
  const fundingRequests = useMockStore((s) => s.fundingRequests);
  const investor = investors.find((inv) => inv.id === id);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isActioning, setIsActioning] = useState(false);
  const toast = useToast();

  if (!investor) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4"><Users className="h-8 w-8 text-neutral-400" /></div>
        <h2 className="text-lg font-semibold text-neutral-900">Investor not found</h2>
        <Link href="/investors" className="mt-4 text-sm text-brand-500 hover:text-brand-600 font-medium">← Back to investors</Link>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsActioning(true);
    const result = await approveAccreditation(investor.id);
    setIsActioning(false);
    if (result.ok) toast.success("Accreditation approved", `${investor.firstName} ${investor.lastName} is now accredited`);
    else toast.error("Failed", result.error);
  };

  const handleReject = async () => {
    setIsActioning(true);
    const result = await rejectAccreditation(investor.id, "Insufficient documentation");
    setIsActioning(false);
    if (result.ok) toast.success("Accreditation rejected", `${investor.firstName} ${investor.lastName} has been rejected`);
    else toast.error("Failed", result.error);
  };

  const returnRate = investor.totalInvested > 0 ? ((investor.portfolioValue - investor.totalInvested) / investor.totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/investors" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-700 transition-colors"><ArrowLeft className="h-4 w-4" />Investors</Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-medium">{investor.firstName} {investor.lastName}</span>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-500 font-bold text-lg">
            {investor.firstName[0]}{investor.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-neutral-900">{investor.firstName} {investor.lastName}</h1>
              <StatusBadge status={investor.accreditationStatus} size="md" />
              <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full",
                investor.type === "INDIVIDUAL" ? "bg-brand-50 text-brand-600" :
                investor.type === "INSTITUTIONAL" ? "bg-success-50 text-success-600" : "bg-warning-50 text-warning-600"
              )}>{TYPE_LABELS[investor.type]}</span>
            </div>
            {investor.companyName && <p className="text-sm text-neutral-500 mt-0.5 flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{investor.companyName}</p>}
            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{investor.city}, {investor.state}</span>
              <span>Last active {formatRelativeTime(investor.lastActivityAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(investor.accreditationStatus === "PENDING" || investor.accreditationStatus === "IN_REVIEW") && (
            <>
              <RoleGuardedAction action="investor:approve_accreditation">
                <button onClick={handleApprove} disabled={isActioning}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg bg-success-500 text-white text-sm font-medium hover:bg-success-600 transition-colors disabled:opacity-50 active:scale-[0.97]">
                  <CheckCircle2 className="h-4 w-4" />Approve
                </button>
              </RoleGuardedAction>
              <RoleGuardedAction action="investor:approve_accreditation">
                <button onClick={handleReject} disabled={isActioning}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg bg-danger-50 text-danger-600 text-sm font-medium hover:bg-danger-100 transition-colors disabled:opacity-50 active:scale-[0.97]">
                  <XCircle className="h-4 w-4" />Reject
                </button>
              </RoleGuardedAction>
            </>
          )}
        </div>
      </div>

      <div className="border-b border-neutral-200">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id ? "text-brand-500" : "text-neutral-500 hover:text-neutral-700")}>
              <tab.icon className="h-4 w-4" />{tab.label}
              {activeTab === tab.id && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" layoutId="investor-tab-indicator" transition={{ duration: 0.2 }} />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }}>
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Invested", value: formatNaira(investor.totalInvested) },
                    { label: "Portfolio Value", value: formatNaira(investor.portfolioValue) },
                    { label: "Return", value: returnRate > 0 ? `+${formatPercent(returnRate)}` : formatPercent(returnRate) },
                    { label: "Active Investments", value: String(investor.activeInvestments) },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-neutral-200 bg-surface p-4">
                      <p className="text-xs text-neutral-500">{m.label}</p>
                      <p className={cn("text-lg font-semibold mt-1", m.label === "Return" && returnRate > 0 ? "text-success-600" : "text-neutral-900")}>{m.value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-neutral-200 bg-surface p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100"><Phone className="h-4 w-4 text-neutral-500" /></div>
                      <div><p className="text-xs text-neutral-500">Phone</p><p className="text-sm font-medium text-neutral-900">{formatPhoneNumber(investor.phone)}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100"><Mail className="h-4 w-4 text-neutral-500" /></div>
                      <div><p className="text-xs text-neutral-500">Email</p><p className="text-sm font-medium text-neutral-900">{investor.email}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100"><MapPin className="h-4 w-4 text-neutral-500" /></div>
                      <div><p className="text-xs text-neutral-500">Location</p><p className="text-sm font-medium text-neutral-900">{investor.city}, {investor.state}</p></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-xl border border-neutral-200 bg-surface p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">Details</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Type", value: TYPE_LABELS[investor.type] },
                      { label: "Risk Tolerance", value: RISK_LABELS[investor.riskTolerance] },
                      { label: "Accredited", value: investor.accreditationDate ? formatDate(investor.accreditationDate) : "N/A" },
                      { label: "Joined CRIFS", value: formatDate(investor.createdAt) },
                      { label: "Last Updated", value: formatDate(investor.updatedAt) },
                    ].map((d) => (
                      <div key={d.label} className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">{d.label}</span>
                        <span className="font-medium text-neutral-900">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-surface p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">Risk Profile</h3>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-sm font-medium px-3 py-1 rounded-full", RISK_COLORS[investor.riskTolerance])}>{RISK_LABELS[investor.riskTolerance]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "investments" && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4"><Wallet className="h-8 w-8 text-neutral-400" /></div>
              <h3 className="text-sm font-semibold text-neutral-900">Investment History</h3>
              <p className="text-sm text-neutral-500 mt-1">Investment details will be connected to funding data</p>
            </div>
          )}
          {activeTab === "documents" && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4"><ShieldCheck className="h-8 w-8 text-neutral-400" /></div>
              <h3 className="text-sm font-semibold text-neutral-900">KYC Documents</h3>
              <p className="text-sm text-neutral-500 mt-1">Document management will be built in Phase 4</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
