"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  TrendingUp, Activity, PieChart as PieIcon, 
  BarChart3, Calendar, Download, Info 
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { formatNairaCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

const SECTOR_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function AnalyticsPage() {
  const fundingRequests = useMockStore((s) => s.fundingRequests);
  const companies = useMockStore((s) => s.companies);

  const sectorData = useMemo(() => {
    const sectors: Record<string, number> = {};
    fundingRequests.forEach(fr => {
      const company = companies.find(c => c.id === fr.companyId);
      const sector = company?.industry || "Other";
      sectors[sector] = (sectors[sector] || 0) + fr.amountRequested;
    });
    return Object.entries(sectors).map(([name, value]) => ({ name, value }));
  }, [fundingRequests, companies]);

  const performanceData = [
    { month: "Jan", disbursed: 45000000, repaid: 12000000 },
    { month: "Feb", disbursed: 52000000, repaid: 18000000 },
    { month: "Mar", disbursed: 48000000, repaid: 25000000 },
    { month: "Apr", disbursed: 61000000, repaid: 31000000 },
    { month: "May", disbursed: 55000000, repaid: 42000000 },
    { month: "Jun", disbursed: 72000000, repaid: 48000000 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-sm text-neutral-500 mt-1">Real-time insights into portfolio health and capital flow</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-10 px-4 rounded-lg border border-neutral-200 bg-white text-sm font-bold text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Year to Date</option>
          </select>
          <button className="h-10 px-4 rounded-lg bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition-all flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <motion.div className="lg:col-span-2 rounded-[2rem] border border-neutral-200 bg-surface p-8 shadow-sm space-y-6"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-900">Capital Flow Trends</h3>
              <p className="text-xs text-neutral-500">Monthly disbursement vs. repayment aggregate</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-brand-500" /><span className="text-[10px] font-bold text-neutral-400 uppercase">Disbursed</span></div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-success-500" /><span className="text-[10px] font-bold text-neutral-400 uppercase">Repaid</span></div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRepaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#9CA3AF' }} tickFormatter={(val) => `₦${val/1000000}M`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                  formatter={(val: any) => [formatNairaCompact(Number(val)), ""]}
                />
                <Area type="monotone" dataKey="disbursed" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorDisbursed)" />
                <Area type="monotone" dataKey="repaid" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRepaid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sector Distribution */}
        <motion.div className="rounded-[2rem] border border-neutral-200 bg-surface p-8 shadow-sm space-y-8"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-neutral-900">Sector Distribution</h3>
            <p className="text-xs text-neutral-500">Capital allocation by industry sector</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sectorData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => formatNairaCompact(Number(val))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {sectorData.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                  <span className="text-neutral-500">{s.name}</span>
                </div>
                <span className="text-neutral-900">{formatNairaCompact(s.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Top Performers */}
        <div className="md:col-span-2 rounded-[2rem] border border-neutral-200 bg-surface p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">Portfolio Performance Ranking</h3>
            <span className="text-[10px] font-bold text-brand-500 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-widest">Live ROI</span>
          </div>
          <div className="space-y-4">
            {fundingRequests.slice(0, 4).map((fr, i) => (
              <div key={fr.id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center font-bold text-neutral-400">#{i+1}</div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{fr.companyName}</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{fr.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-success-600">+{8 + i * 2.5}%</p>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Yield Rank</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-[2rem] bg-neutral-900 p-8 text-white space-y-8 shadow-xl shadow-neutral-900/10">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Platform Health</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: "Default Rate", value: "0.4%", target: "Target < 1.0%", color: "bg-success-500" },
              { label: "Liquidity Ratio", value: "3.2x", target: "Target > 2.5x", color: "bg-brand-500" },
              { label: "Vesting Velocity", value: "88%", target: "Target > 80%", color: "bg-brand-accent" },
            ].map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">{metric.label}</span>
                  <span className="text-sm font-bold">{metric.value}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", metric.color)} style={{ width: metric.value === "88%" ? "88%" : "70%" }} />
                </div>
                <p className="text-[9px] text-neutral-500 font-medium italic">{metric.target}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Last Engine Sync</p>
            <p className="text-xs font-medium text-neutral-300 mt-1">May 08, 2026 • 21:51:07 WAT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
