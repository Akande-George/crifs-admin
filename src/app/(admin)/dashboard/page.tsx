"use client";

import { motion } from "motion/react";
import {
  Building2,
  Users,
  Wallet,
  ShieldCheck,
  TrendingUp,
  FileText,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { MetricCard } from "@/components/molecules/MetricCard";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatNairaCompact, formatRelativeTime } from "@/lib/format";
import { useMockStore } from "@/lib/mock/store";
import { stagger, staggerChild } from "@/lib/motion";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

/* ─── Chart Data ─── */

const fundingTrendData = [
  { month: "Oct", amount: 45_000_000 },
  { month: "Nov", amount: 78_000_000 },
  { month: "Dec", amount: 62_000_000 },
  { month: "Jan", amount: 95_000_000 },
  { month: "Feb", amount: 110_000_000 },
  { month: "Mar", amount: 88_000_000 },
  { month: "Apr", amount: 135_000_000 },
  { month: "May", amount: 142_000_000 },
];

const sectorData = [
  { sector: "Agri", value: 320_000_000 },
  { sector: "Manuf", value: 280_000_000 },
  { sector: "Tech", value: 195_000_000 },
  { sector: "Energy", value: 150_000_000 },
  { sector: "F&B", value: 120_000_000 },
  { sector: "Health", value: 85_000_000 },
];

/* ─── Pipeline Visual ─── */

const pipelineStages = [
  { label: "Application", count: 12, color: "bg-neutral-400" },
  { label: "Doc Review", count: 8, color: "bg-flag-500" },
  { label: "AI Analysis", count: 5, color: "bg-brand-500" },
  { label: "Committee", count: 3, color: "bg-warning-500" },
  { label: "Approved", count: 7, color: "bg-success-500" },
  { label: "Disbursed", count: 15, color: "bg-brand-accent" },
];

/* ─── Recent Activity ─── */

const recentActivity = [
  {
    id: "1",
    action: "Lagos AgriTech Ltd submitted a new funding request",
    time: "2026-05-08T10:30:00.000Z",
    type: "funding" as const,
  },
  {
    id: "2",
    action: "Amina Mohammed approved KYC for Heritage Foods Nigeria",
    time: "2026-05-08T09:15:00.000Z",
    type: "kyc" as const,
  },
  {
    id: "3",
    action: "Voting round completed for Kano Textiles International",
    time: "2026-05-07T17:00:00.000Z",
    type: "voting" as const,
  },
  {
    id: "4",
    action: "₦25M disbursed to Calabar Cocoa Exporters",
    time: "2026-05-07T15:30:00.000Z",
    type: "finance" as const,
  },
  {
    id: "5",
    action: "New investor application: Chief Adebowale Abiodun",
    time: "2026-05-07T14:00:00.000Z",
    type: "investor" as const,
  },
];

const activityIcons: Record<string, React.ElementType> = {
  funding: Wallet,
  kyc: ShieldCheck,
  voting: Users,
  finance: TrendingUp,
  investor: Users,
  document: FileText,
};

/* ─── Dashboard Page ─── */

export default function DashboardPage() {
  const companies = useMockStore((s) => s.companies);
  const activeCompanies = companies.filter((c) => c.status === "ACTIVE").length;
  const pendingKyc = companies.filter(
    (c) => c.status === "PENDING_REVIEW" || c.status === "KYC_IN_PROGRESS"
  ).length;
  const totalFunding = companies.reduce((sum, c) => sum + c.totalFundingRaised, 0);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 mt-1">
          Overview of the CRIFS Investment Platform
        </p>
      </div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger(0.08)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={staggerChild}>
          <MetricCard
            title="Active Companies"
            value={activeCompanies}
            icon={Building2}
            iconColor="bg-brand-50 text-brand-500"
            trend={{ value: 12, label: "vs last month" }}
          />
        </motion.div>
        <motion.div variants={staggerChild}>
          <MetricCard
            title="Total Investors"
            value={47}
            icon={Users}
            iconColor="bg-success-50 text-success-600"
            trend={{ value: 8, label: "vs last month" }}
          />
        </motion.div>
        <motion.div variants={staggerChild}>
          <MetricCard
            title="Total Funding Raised"
            value={totalFunding}
            formatter={formatNairaCompact}
            icon={Wallet}
            iconColor="bg-warning-50 text-warning-600"
            trend={{ value: 23, label: "vs last month" }}
          />
        </motion.div>
        <motion.div variants={staggerChild}>
          <MetricCard
            title="Pending KYC"
            value={pendingKyc}
            icon={ShieldCheck}
            iconColor="bg-flag-50 text-flag-600"
            trend={{ value: -15, label: "vs last month" }}
          />
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 rounded-xl border border-neutral-200 bg-surface p-4 md:p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Funding Trend</h2>
              <p className="text-[10px] md:text-xs text-neutral-500 mt-0.5">Monthly funding volume</p>
            </div>
            <span className="text-[10px] font-medium text-success-600 bg-success-50 px-2 py-1 rounded-full self-start sm:self-center">
              +23% this month
            </span>
          </div>
          <div className="h-[200px] md:h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fundingTrendData}>
                <defs>
                  <linearGradient id="fundingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A2099" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2A2099" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis
                  hide={window.innerWidth < 640}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `₦${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px", fontSize: "10px", color: "#F9FAFB" }}
                  formatter={(value) => [`₦${(Number(value) / 1_000_000).toFixed(1)}M`, "Funding"]}
                />
                <Area type="monotone" dataKey="amount" stroke="#2A2099" strokeWidth={2} fill="url(#fundingGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl border border-neutral-200 bg-surface p-4 md:p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-neutral-900 mb-1">By Sector</h2>
          <p className="text-[10px] md:text-xs text-neutral-500 mb-4">Funding distribution</p>
          <div className="h-[200px] md:h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical" barCategoryGap={6}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="sector" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px", fontSize: "10px", color: "#F9FAFB" }} />
                <Bar dataKey="value" fill="#3B2FBB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funding Pipeline */}
        <motion.div
          className="rounded-xl border border-neutral-200 bg-surface p-4 md:p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-neutral-900">Pipeline</h2>
            <Link href="/funding" className="text-[10px] font-medium text-brand-500 hover:text-brand-600 flex items-center gap-0.5">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {pipelineStages.map((stage) => (
              <div key={stage.label} className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                <span className="text-xs text-neutral-700 flex-1">{stage.label}</span>
                <span className="text-xs font-semibold text-neutral-900">{stage.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2 rounded-xl border border-neutral-200 bg-surface p-4 md:p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-neutral-900">Recent Activity</h2>
            <Link href="/audit" className="text-[10px] font-medium text-brand-500 hover:text-brand-600 flex items-center gap-0.5">
              View audit log <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {recentActivity.map((activity) => {
              const Icon = activityIcons[activity.type] ?? Clock;
              return (
                <div key={activity.id} className="flex items-start gap-3 rounded-lg py-2 transition-colors">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <Icon className="h-3.5 w-3.5 text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-700 leading-snug truncate sm:whitespace-normal">
                      {activity.action}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {formatRelativeTime(activity.time)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Companies Quick View */}
      <motion.div
        className="rounded-xl border border-neutral-200 bg-surface p-4 md:p-5 overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-900">Recent Companies</h2>
          <Link href="/companies" className="text-[10px] font-medium text-brand-500 hover:text-brand-600 flex items-center gap-0.5">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto -mx-4 md:-mx-5 px-4 md:px-5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="py-2.5 pr-4 text-[10px] font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">Company</th>
                <th className="hidden md:table-cell py-2.5 px-4 text-[10px] font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="py-2.5 pl-4 text-right text-[10px] font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">Funding</th>
              </tr>
            </thead>
            <tbody>
              {companies.slice(0, 5).map((company) => (
                <tr key={company.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-500 font-semibold text-[10px] shrink-0">
                        {company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-neutral-900 text-xs truncate">{company.name}</p>
                        <p className="text-[10px] text-neutral-400">RC-{company.rcNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-3 px-4">
                    <StatusBadge status={company.status} size="sm" />
                  </td>
                  <td className="py-3 pl-4 text-right font-medium text-neutral-900 text-xs">
                    {formatNairaCompact(company.totalFundingRaised)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
