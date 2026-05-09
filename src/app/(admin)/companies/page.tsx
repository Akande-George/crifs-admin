"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Building2,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatNairaCompact, formatRelativeTime, formatDate } from "@/lib/format";
import { stagger, staggerChild } from "@/lib/motion";
import type { CompanyStatus } from "@/lib/zod/company";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: CompanyStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending Review", value: "PENDING_REVIEW" },
  { label: "KYC In Progress", value: "KYC_IN_PROGRESS" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function CompaniesPage() {
  const companies = useMockStore((s) => s.companies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CompanyStatus | "ALL">("ALL");
  const [sortField, setSortField] = useState<"name" | "totalFundingRaised" | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...companies];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.rcNumber.includes(q) ||
          c.state.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === "string" ? aVal.localeCompare(String(bVal)) : Number(aVal) - Number(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [companies, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: companies.length };
    for (const c of companies) {
      counts[c.status] = (counts[c.status] ?? 0) + 1;
    }
    return counts;
  }, [companies]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Companies
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage registered companies and their KYC status
          </p>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors active:scale-[0.97]">
          <Plus className="h-4 w-4" />
          Add Company
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Status filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setStatusFilter(filter.value);
                setPage(1);
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                statusFilter === filter.value
                  ? "bg-brand-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              )}
            >
              {filter.label}
              <span
                className={cn(
                  "ml-0.5 text-[10px] rounded-full px-1.5 py-0.5",
                  statusFilter === filter.value
                    ? "bg-white/20 text-white"
                    : "bg-neutral-200 text-neutral-500"
                )}
              >
                {statusCounts[filter.value] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, industry, RC number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <span className="text-xs text-neutral-400">
            {filtered.length} {filtered.length === 1 ? "company" : "companies"}
          </span>
        </div>
      </div>

      {/* Table */}
      <motion.div
        className="rounded-xl border border-neutral-200 bg-surface overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50/80">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-neutral-700"
                    onClick={() => toggleSort("name")}
                  >
                    Company <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="hidden lg:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  State
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden sm:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Risk
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 ml-auto hover:text-neutral-700"
                    onClick={() => toggleSort("totalFundingRaised")}
                  >
                    Funding <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="hidden lg:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginated.map((company) => (
                <motion.tr
                  key={company.id}
                  className="group hover:bg-neutral-50/50 transition-colors"
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.12 }}
                >
                  <td className="py-3.5 px-4">
                    <Link href={`/companies/${company.id}`} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-500 font-semibold text-xs shrink-0">
                        {company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 group-hover:text-brand-500 transition-colors">
                          {company.name}
                        </p>
                        <p className="text-xs text-neutral-400">RC-{company.rcNumber}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="hidden lg:table-cell py-3.5 px-4 text-neutral-600">{company.industry}</td>
                  <td className="hidden md:table-cell py-3.5 px-4 text-neutral-600">{company.state}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={company.status} />
                  </td>
                  <td className="hidden sm:table-cell py-3.5 px-4">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        company.riskLevel === "LOW" && "bg-success-50 text-success-600",
                        company.riskLevel === "MEDIUM" && "bg-warning-50 text-warning-600",
                        company.riskLevel === "HIGH" && "bg-danger-50 text-danger-600"
                      )}
                    >
                      {company.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-neutral-900">
                    {formatNairaCompact(company.totalFundingRaised)}
                  </td>
                  <td className="hidden lg:table-cell py-3.5 px-4 text-neutral-400 text-xs">
                    {formatDate(company.incorporationDate)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/companies/${company.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
            <p className="text-xs text-neutral-500">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                    p === page
                      ? "bg-brand-500 text-white"
                      : "text-neutral-500 hover:bg-neutral-100"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4">
            <Building2 className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900">No companies found</h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-sm">
            {search
              ? `No companies match "${search}". Try a different search term.`
              : "No companies match the selected filters."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
