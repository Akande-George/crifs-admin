"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  FileText,
  Wallet,
  ScrollText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { RoleGuardedAction } from "@/components/organisms/RoleGuardedAction";
import { formatNaira, formatNairaCompact, formatDate, formatRelativeTime, formatRCNumber, formatPhoneNumber } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import { approveCompany, rejectCompany, suspendCompany } from "@/lib/mock/handlers/companies";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "documents", label: "Docs", icon: FileText },
  { id: "funding", label: "Funding", icon: Wallet },
  { id: "audit", label: "Audit", icon: ScrollText },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const companies = useMockStore((s) => s.companies);
  const company = companies.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const toast = useToast();
  const [isActioning, setIsActioning] = useState(false);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-20 md:py-24 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4">
          <Building2 className="h-8 w-8 text-neutral-400" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">Company not found</h2>
        <Link href="/companies" className="mt-4 text-sm text-brand-500 hover:text-brand-600 font-medium">
          ← Back to companies
        </Link>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsActioning(true);
    const result = await approveCompany(company.id);
    setIsActioning(false);
    if (result.ok) toast.success("Company approved", `${company.name} is now active`);
  };

  const handleReject = async () => {
    setIsActioning(true);
    const result = await rejectCompany(company.id, "Insufficient documentation");
    setIsActioning(false);
    if (result.ok) toast.success("Company rejected", `${company.name} has been rejected`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] md:text-sm">
        <Link href="/companies" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-700 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Companies
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-medium truncate max-w-[150px] md:max-w-none">{company.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-500 font-bold text-base md:text-lg shrink-0">
            {company.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <h1 className="text-lg md:text-xl font-bold text-neutral-900 truncate">{company.name}</h1>
              <StatusBadge status={company.status} size="sm" />
            </div>
            <p className="text-xs md:text-sm text-neutral-500 mt-1 line-clamp-2">{company.description}</p>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 text-[10px] md:text-xs text-neutral-400">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {company.city}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> RC-{company.rcNumber}</span>
              <span className="hidden sm:inline">Last active {formatRelativeTime(company.lastActivityAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(company.status === "PENDING_REVIEW" || company.status === "KYC_IN_PROGRESS") && (
            <>
              <RoleGuardedAction action="company:approve_kyc">
                <button onClick={handleApprove} disabled={isActioning} className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-success-500 text-white text-xs md:text-sm font-bold hover:bg-success-600 transition-all disabled:opacity-50">
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
              </RoleGuardedAction>
              <RoleGuardedAction action="company:approve_kyc">
                <button onClick={handleReject} disabled={isActioning} className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-danger-50 text-danger-600 text-xs md:text-sm font-bold hover:bg-danger-100 transition-all disabled:opacity-50">
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </RoleGuardedAction>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-3 md:px-4 py-3 text-xs md:text-sm font-bold transition-all whitespace-nowrap",
                activeTab === tab.id ? "text-brand-500" : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" layoutId="company-tab-indicator" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Funding", value: formatNairaCompact(company.totalFundingRaised) },
                    { label: "Active Req", value: String(company.activeFundingRequests) },
                    { label: "KYC Score", value: company.kycScore ? `${company.kycScore}%` : "—" },
                    { label: "Risk", value: company.riskLevel },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-neutral-200 bg-surface p-3 md:p-4">
                      <p className="text-[10px] md:text-xs text-neutral-500 font-bold uppercase tracking-wider">{m.label}</p>
                      <p className="text-sm md:text-base font-bold text-neutral-900 mt-1">{m.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-surface p-4 md:p-5">
                  <h3 className="text-sm font-bold text-neutral-900 mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 shrink-0"><Phone className="h-4 w-4 text-neutral-500" /></div>
                      <div className="min-w-0"><p className="text-[10px] text-neutral-500 font-bold uppercase">Phone</p><p className="text-sm font-medium truncate">{formatPhoneNumber(company.phone)}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 shrink-0"><Mail className="h-4 w-4 text-neutral-500" /></div>
                      <div className="min-w-0"><p className="text-[10px] text-neutral-500 font-bold uppercase">Email</p><p className="text-sm font-medium truncate">{company.email}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 shrink-0"><MapPin className="h-4 w-4 text-neutral-500" /></div>
                      <div className="min-w-0"><p className="text-[10px] text-neutral-500 font-bold uppercase">Address</p><p className="text-xs md:text-sm font-medium">{company.address}</p></div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-surface p-4 md:p-5">
                  <h3 className="text-sm font-bold text-neutral-900 mb-4">Board Members</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {company.directorNames.map((name, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-[10px] font-bold">{name.split(" ").map(n => n[0]).join("")}</div>
                        <span className="text-sm font-bold text-neutral-800">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="rounded-2xl border border-neutral-200 bg-surface p-5 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900">Registration</h3>
                  <div className="space-y-3">
                    {[
                      { label: "RC Number", value: formatRCNumber(company.rcNumber) },
                      { label: "Industry", value: company.industry },
                      { label: "Incorporated", value: formatDate(company.incorporationDate) },
                    ].map(d => (
                      <div key={d.label} className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500 font-medium">{d.label}</span>
                        <span className="font-bold text-neutral-900">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab !== "overview" && (
             <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400">
               <p className="text-sm font-bold">Details for {activeTab} will appear here.</p>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
