"use client";

import { use, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { 
  ArrowLeft, Building2, Calendar, FileText, BarChart3, 
  TrendingUp, Wallet, ShieldCheck, CheckCircle2, 
  ArrowUpRight, Users, MapPin, Globe, Mail, 
  Briefcase, Award, Zap
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { formatNaira, formatNairaCompact, formatDate, formatPercent } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "opportunity", label: "Opportunity", icon: Zap },
  { id: "business", label: "Business", icon: Building2 },
  { id: "traction", label: "Traction", icon: TrendingUp },
  { id: "prospectus", label: "Prospectus", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function MarketplaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const companies = useMockStore((s) => s.companies);
  const fundingRequests = useMockStore((s) => s.fundingRequests);
  const [activeTab, setActiveTab] = useState<TabId>("opportunity");

  const company = companies.find((c) => c.id === id);
  const companyFunding = useMemo(() => 
    fundingRequests.filter((fr) => fr.companyId === id).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ), [fundingRequests, id]
  );
  
  const activeRequest = useMemo(() => 
    companyFunding.find((fr) => ["APPROVED", "DISBURSEMENT", "COMMITTEE_REVIEW"].includes(fr.stage)),
    [companyFunding]
  );

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4">
          <Building2 className="h-8 w-8 text-neutral-400" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">Opportunity not found</h2>
        <Link href="/marketplace" className="mt-4 text-sm text-brand-500 font-medium hover:underline">
          ← Back to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/marketplace" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-700 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Marketplace
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-medium truncate max-w-[200px] md:max-w-none">{company.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-lg border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
            Share Opportunity
          </button>
          <button className="h-10 px-6 rounded-lg bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition-all active:scale-95 shadow-lg shadow-brand-500/20">
            Manage Round
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200 bg-surface shadow-sm">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-brand-500/10 via-brand-accent/10 to-brand-500/5" />
        
        <div className="relative pt-16 px-8 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="flex items-end gap-6">
            <div className="h-24 w-24 rounded-3xl bg-surface border-4 border-surface shadow-xl flex items-center justify-center text-brand-600 font-bold text-3xl shrink-0">
              {company.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="pb-2 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{company.name}</h1>
                <Badge className="bg-brand-50 text-brand-600 border-brand-100 uppercase tracking-wider font-bold">
                  {company.industry}
                </Badge>
              </div>
              <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
                {company.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-neutral-500 pt-2">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-500" /> {company.city}, {company.state}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-brand-500" /> Founded {formatDate(company.incorporationDate, "yyyy")}</span>
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-brand-500" /> {company.website?.replace("https://", "")}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pb-2">
            <div className="text-center px-6 py-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Total Raised</p>
              <p className="text-xl font-bold text-neutral-900">{formatNairaCompact(company.totalFundingRaised)}</p>
            </div>
            <div className="text-center px-6 py-3 rounded-2xl bg-neutral-50 border border-neutral-100">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">KYC Score</p>
              <p className="text-xl font-bold text-brand-600">{company.kycScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - 8/12 */}
        <div className="lg:col-span-8 space-y-8">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-2xl w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-surface text-brand-600 shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-800"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "opportunity" && (
                <div className="space-y-6">
                  {activeRequest ? (
                    <div className="rounded-3xl border-2 border-brand-500/20 bg-brand-50/10 overflow-hidden">
                      <div className="bg-brand-500 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-white" />
                          <h3 className="text-lg font-bold text-white">Active Funding Round</h3>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30 uppercase tracking-widest font-bold">
                          {activeRequest.stage.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      
                      <div className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Target Amount</p>
                              <p className="text-4xl font-black text-neutral-900 tracking-tight">{formatNaira(activeRequest.amountRequested)}</p>
                            </div>
                            <div className="pt-4 space-y-2">
                              <div className="flex items-center justify-between text-sm font-bold">
                                <span className="text-neutral-600">Fundraising Goal</span>
                                <span className="text-brand-600">Active Stage</span>
                              </div>
                              <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-brand-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: "65%" }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Tenure</p>
                              <p className="text-lg font-bold text-neutral-900">{activeRequest.tenure || "—"} Months</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Est. Return</p>
                              <p className="text-lg font-bold text-success-600">{activeRequest.interestRate || "—"}% p.a.</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Risk Score</p>
                              <p className="text-lg font-bold text-neutral-900">{activeRequest.riskScore || "—"}/100</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">AI Validation</p>
                              <p className="text-lg font-bold text-brand-500">{activeRequest.aiScore || "—"}% Confidence</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-neutral-100">
                          <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-6">Allocation of Funds</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {activeRequest.useOfFunds.map((use) => (
                              <div key={use.name} className="space-y-2">
                                <div className="flex items-center justify-between text-sm font-bold">
                                  <span className="text-neutral-700">{use.name}</span>
                                  <span className="text-neutral-900">{formatNairaCompact(use.amount)}</span>
                                </div>
                                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-brand-500/80 rounded-full"
                                    style={{ width: `${use.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
                      <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center mx-auto mb-4">
                        <Wallet className="h-8 w-8 text-neutral-300" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900">No active funding round</h3>
                      <p className="text-neutral-500 mt-2">This company is currently not seeking new investment.</p>
                    </div>
                  )}

                  <div className="rounded-3xl border border-neutral-200 bg-surface p-8 space-y-6">
                    <h3 className="text-lg font-bold text-neutral-900">Opportunity Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { icon: Award, title: "Market Leader", desc: "Leading provider of logistics solutions in the Southwest region with 35% market share." },
                        { icon: Users, title: "Experienced Management", desc: "Founders with combined 40+ years experience in FMCG and supply chain logistics." },
                        { icon: TrendingUp, title: "Scalable Model", desc: "Asset-light expansion model allowing for rapid entry into new state markets." },
                        { icon: ShieldCheck, title: "Secured Assets", desc: "Funding backed by tangible assets including a fleet of 50+ modern delivery trucks." },
                      ].map((item) => (
                        <div key={item.title} className="flex gap-4">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-50 flex items-center justify-center">
                            <item.icon className="h-5 w-5 text-brand-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-neutral-900">{item.title}</h4>
                            <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "business" && (
                <div className="rounded-3xl border border-neutral-200 bg-surface p-8 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-neutral-900">About {company.name}</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Founded in {formatDate(company.incorporationDate, "yyyy")}, {company.name} has been at the forefront of {company.industry.toLowerCase()} in Nigeria. 
                      Starting with a single warehouse in {company.city}, the company has expanded its operations to cover multiple states, 
                      providing essential services to over 200 corporate clients.
                    </p>
                    <p className="text-neutral-600 leading-relaxed">
                      Our mission is to bridge the infrastructure gap in the Nigerian market through innovation and technology-driven solutions. 
                      We believe in sustainable growth that benefits our investors, employees, and the communities we serve.
                    </p>
                  </div>

                  <div className="pt-8 border-t border-neutral-100">
                    <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-6">Key Personnel</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {company.directorNames.map((name) => (
                        <div key={name} className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                          <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                            {name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-900">{name}</p>
                            <p className="text-xs text-neutral-500">Director</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "traction" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-neutral-200 bg-surface p-8">
                    <h3 className="text-lg font-bold text-neutral-900 mb-6">Previous Funding Rounds</h3>
                    <div className="space-y-4">
                      {companyFunding.filter(fr => fr.stage === "COMPLETED" || fr.stage === "ACTIVE").map((fr) => (
                        <div key={fr.id} className="flex items-center justify-between p-5 rounded-2xl border border-neutral-100 hover:border-brand-200 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-success-50 flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-success-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-neutral-900">{fr.title}</p>
                              <p className="text-xs text-neutral-500">{formatDate(fr.approvedAt || fr.createdAt)} • {fr.tenure} Months</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-neutral-900">{formatNaira(fr.amountApproved || fr.amountRequested)}</p>
                            <p className="text-xs text-success-600 font-bold">{fr.interestRate}% Interest</p>
                          </div>
                        </div>
                      ))}
                      {companyFunding.filter(fr => fr.stage === "COMPLETED" || fr.stage === "ACTIVE").length === 0 && (
                        <p className="text-sm text-neutral-500 text-center py-8">No historical funding data available.</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-neutral-200 bg-surface p-8">
                      <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-6">Compliance Record</h4>
                      <div className="space-y-4">
                        {[
                          { label: "KYC Status", value: "Verified", color: "text-success-600" },
                          { label: "Tax Clearance", value: "Current", color: "text-success-600" },
                          { label: "Audit Frequency", value: "Annual", color: "text-neutral-900" },
                          { label: "Default Rate", value: "0%", color: "text-success-600" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                            <span className="text-sm text-neutral-500">{item.label}</span>
                            <span className={cn("text-sm font-bold", item.color)}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl border border-neutral-200 bg-surface p-8 flex flex-col justify-center items-center text-center">
                      <div className="h-20 w-20 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                        <TrendingUp className="h-10 w-10 text-brand-600" />
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900">Steady Growth</h4>
                      <p className="text-sm text-neutral-500 mt-2">
                        Consistently meeting 100% of repayment milestones over the last 3 years of platform participation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "prospectus" && (
                <div className="rounded-3xl border border-neutral-200 bg-surface p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-neutral-900">Offering Documents</h3>
                    <Badge variant="outline" className="text-brand-600 border-brand-200">
                      Phase 4 Ready
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: "Executive Summary", size: "2.4 MB", date: "May 2026" },
                      { name: "Full Investment Memorandum", size: "15.8 MB", date: "May 2026" },
                      { name: "Financial Projections (3-Year)", size: "4.2 MB", date: "Apr 2026" },
                      { name: "Company Profile & KYC Pack", size: "8.1 MB", date: "Jan 2026" },
                    ].map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100 group cursor-pointer hover:bg-neutral-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-neutral-400 group-hover:text-brand-500 transition-colors">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-900">{doc.name}</p>
                            <p className="text-xs text-neutral-500">{doc.size} • Uploaded {doc.date}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-neutral-300 group-hover:text-brand-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 p-6 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold">Request Private Deal Room</h4>
                      <p className="text-sm text-neutral-400">Access full data room including detailed audits and legal paperwork.</p>
                    </div>
                    <button className="h-12 px-8 rounded-xl bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/20 whitespace-nowrap">
                      Grant Access
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column - 4/12 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats Card */}
          <div className="rounded-3xl border border-neutral-200 bg-surface p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">At a Glance</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Business Model</p>
                  <p className="text-sm font-bold text-neutral-900">B2B Logistics Services</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Target Segment</p>
                  <p className="text-sm font-bold text-neutral-900">FMCG & Retail Corporates</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Growth Rate</p>
                  <p className="text-sm font-bold text-success-600">+42% YoY Revenue</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Asset Backing</p>
                  <p className="text-sm font-bold text-neutral-900">100% (Fleet & Real Estate)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof/Verification */}
          <div className="rounded-3xl bg-neutral-900 p-6 space-y-6 text-white shadow-xl shadow-neutral-900/10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest">CRIFS Verified</h3>
            </div>
            
            <p className="text-sm text-neutral-400 leading-relaxed">
              This opportunity has passed all 5 stages of CRIFS verification including AI analysis, KYC, and site inspection.
            </p>
            
            <div className="space-y-3">
              {[
                "Financial Audit Verified",
                "Director Identity Confirmed",
                "Asset Registry Validated",
                "Legal Compliance Checked"
              ].map((check) => (
                <div key={check} className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" />
                  {check}
                </div>
              ))}
            </div>
          </div>

          {/* Admin Tools */}
          <div className="rounded-3xl border border-neutral-200 bg-surface p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Admin Actions</h3>
            <div className="space-y-2">
              <button className="w-full h-11 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
                Edit Listing Details
              </button>
              <button className="w-full h-11 rounded-xl border border-danger-100 text-sm font-bold text-danger-600 hover:bg-danger-50 transition-colors">
                Unlist from Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
