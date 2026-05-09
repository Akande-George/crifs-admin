"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Search, ArrowUpRight, BarChart3, Store } from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { formatNairaCompact, formatRelativeTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const INDUSTRIES = ["All", "Agriculture", "Technology", "Manufacturing", "Energy", "Food & Beverage", "Healthcare"];

export default function MarketplacePage() {
  const companies = useMockStore((s) => s.companies);
  const fundingRequests = useMockStore((s) => s.fundingRequests);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");

  const marketplaceItems = useMemo(() => {
    return companies
      .filter((c) => c.status === "ACTIVE")
      .map((company) => {
        const companyFunding = fundingRequests.filter((fr) => fr.companyId === company.id);
        const activeRequest = companyFunding.find((fr) => ["APPROVED", "DISBURSEMENT", "COMMITTEE_REVIEW"].includes(fr.stage));
        
        return {
          ...company,
          activeRequest,
          fundingCount: companyFunding.length,
        };
      })
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                             item.industry.toLowerCase().includes(search.toLowerCase());
        const matchesIndustry = industryFilter === "All" || item.industry === industryFilter;
        return matchesSearch && matchesIndustry;
      });
  }, [companies, fundingRequests, search, industryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">Investment Marketplace</h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">Discover and manage active investment opportunities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustryFilter(ind)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap transition-all",
                industryFilter === ind 
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {marketplaceItems.map((company, i) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="group rounded-2xl border border-neutral-200 bg-surface overflow-hidden hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/5 transition-all flex flex-col"
          >
            <div className="p-4 md:p-5 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-base md:text-lg shrink-0">
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <Badge variant="secondary" className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider">
                    {company.industry}
                  </Badge>
                  {company.riskLevel && (
                    <span className={cn(
                      "text-[9px] md:text-[10px] font-bold mt-1",
                      company.riskLevel === "LOW" ? "text-success-600" : company.riskLevel === "MEDIUM" ? "text-warning-600" : "text-danger-600"
                    )}>
                      {company.riskLevel} RISK
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-neutral-900 group-hover:text-brand-500 transition-colors truncate">
                {company.name}
              </h3>
              <p className="text-xs md:text-sm text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                {company.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Total Funding</p>
                  <p className="text-xs md:text-sm font-bold text-neutral-900">{formatNairaCompact(company.totalFundingRaised)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[10px] font-medium text-neutral-400 uppercase tracking-wider">KYC Score</p>
                  <p className="text-xs md:text-sm font-bold text-neutral-900">{company.kycScore}%</p>
                </div>
              </div>

              {company.activeRequest && (
                <div className="mt-4 md:mt-6 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                    <span className="text-[9px] md:text-[10px] font-bold text-brand-600 uppercase tracking-wider">Opportunity</span>
                    <span className="text-[9px] md:text-[10px] font-medium text-neutral-400">{formatRelativeTime(company.activeRequest.submittedAt)}</span>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-neutral-900 truncate">{company.activeRequest.title}</p>
                  <p className="text-[11px] md:text-xs text-brand-500 font-bold mt-1">{formatNairaCompact(company.activeRequest.amountRequested)} Seeking</p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 md:px-5 md:py-4 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
              <span className="text-[10px] md:text-xs text-neutral-500 flex items-center gap-1">
                <BarChart3 className="h-3 w-3" /> {company.fundingCount} rounds
              </span>
              <Link
                href={`/marketplace/${company.id}`}
                className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors"
              >
                View <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {marketplaceItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <Store className="h-8 w-8 md:h-10 md:w-10 text-neutral-400" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-neutral-900">No opportunities found</h2>
          <p className="text-xs md:text-sm text-neutral-500 mt-2 max-w-xs md:max-w-md">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
