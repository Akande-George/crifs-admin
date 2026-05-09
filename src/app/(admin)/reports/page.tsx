"use client";

import { 
  BarChart3, Download, FileText, 
  Calendar, ArrowUpRight, TrendingUp,
  DollarSign, PieChart, Clock
} from "lucide-react";
import { MetricCard } from "@/components/molecules/MetricCard";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { formatNaira } from "@/lib/format";

const systemReports = [
  { id: "REP-001", name: "Monthly Financial Summary", date: "2026-04-30", type: "PDF", size: "2.4 MB" },
  { id: "REP-002", name: "Quarterly Risk Assessment", date: "2026-03-31", type: "PDF", size: "5.1 MB" },
  { id: "REP-003", name: "Platform Activity Audit", date: "2026-05-08", type: "XLSX", size: "1.2 MB" },
  { id: "REP-004", name: "Investor Portfolio Performance", date: "2026-05-01", type: "PDF", size: "3.8 MB" },
  { id: "REP-005", name: "Funding Disbursement Log", date: "2026-05-07", type: "CSV", size: "850 KB" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">System Reports</h1>
          <p className="text-sm text-neutral-500">Access and export comprehensive platform data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Disbursements"
          value={1250000000}
          formatter={(v) => formatNaira(v)}
          icon={DollarSign}
          trend={{ value: 12.5, label: "vs last month" }}
        />
        <MetricCard
          title="Active Capital"
          value={850000000}
          formatter={(v) => formatNaira(v)}
          icon={TrendingUp}
          trend={{ value: 5.2, label: "vs last month" }}
          iconColor="bg-blue-50 text-blue-500"
        />
        <MetricCard
          title="Default Rate"
          value={1.2}
          formatter={(v) => `${v}%`}
          icon={PieChart}
          trend={{ value: -0.4, label: "vs last month" }}
          iconColor="bg-success-50 text-success-500"
        />
        <MetricCard
          title="Avg. Review Time"
          value={4.5}
          formatter={(v) => `${v} days`}
          icon={Clock}
          trend={{ value: -1.2, label: "vs last month" }}
          iconColor="bg-warning-50 text-warning-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Charts Preview Placeholder */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-neutral-900">Funding Performance</h3>
          <div className="min-h-[300px] md:aspect-[16/9] w-full rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 flex flex-col justify-end">
            <div className="flex items-end justify-between h-full gap-4">
              {[40, 65, 45, 90, 75, 55, 80, 60, 85, 70, 95, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-brand-500/20 group-hover:bg-brand-500 transition-all rounded-t-sm" 
                    style={{ height: `${h}%` }} 
                  />
                  <span className="text-[10px] text-neutral-400 font-bold">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Downloads */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-900">Recent Reports</h3>
          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Filename</span>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Type</span>
            </div>
            <div className="divide-y divide-neutral-100">
              {systemReports.map((report) => (
                <div key={report.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900 group-hover:text-brand-500 transition-colors">{report.name}</p>
                      <p className="text-[10px] text-neutral-400">{report.date} • {report.size}</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
