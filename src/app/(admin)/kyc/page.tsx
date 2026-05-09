"use client";

import { useState } from "react";
import { 
  ShieldCheck, Search, Filter, 
  MoreHorizontal, Eye, CheckCircle2, 
  XCircle, ArrowUpDown, Building2, User
} from "lucide-react";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { mockCompanies } from "@/lib/mock/data/companies";
import { mockInvestors } from "@/lib/mock/data/investors";
import { cn } from "@/lib/utils";

// Combine and normalize data for KYC Queue
const kycQueueData = [
  ...mockCompanies
    .filter(c => c.status === "PENDING_REVIEW" || c.status === "KYC_IN_PROGRESS")
    .map(c => ({
      id: c.id,
      name: c.name,
      type: "COMPANY" as const,
      status: c.status,
      date: c.createdAt,
      risk: c.riskLevel,
      score: c.kycScore || 0,
    })),
  ...mockInvestors
    .filter(i => i.accreditationStatus === "PENDING" || i.accreditationStatus === "IN_REVIEW")
    .map(i => ({
      id: i.id,
      name: `${i.firstName} ${i.lastName}`,
      type: "INVESTOR" as const,
      status: i.accreditationStatus,
      date: i.createdAt,
      risk: i.riskTolerance === "AGGRESSIVE" ? "HIGH" : i.riskTolerance === "MODERATE" ? "MEDIUM" : "LOW",
      score: 0, // Investors might not have a score yet
    }))
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function KYCQueuePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredData = kycQueueData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">KYC Queue</h1>
          <p className="text-sm text-neutral-500">Monitor and approve pending identity verifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Verification Settings
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search by name..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 h-10 px-4 rounded-lg border border-neutral-200 bg-white text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-all">
              <Filter className="mr-2 h-4 w-4" />
              Status: {statusFilter === "ALL" ? "All" : statusFilter.replace(/_/g, " ")}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("PENDING_REVIEW")}>Pending Review</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("KYC_IN_PROGRESS")}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>Pending (Investor)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("IN_REVIEW")}>In Review (Investor)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Queue Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50/50">
                <TableHead className="w-[300px]">Entity</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Submission Date</TableHead>
                <TableHead className="hidden sm:table-cell">Risk Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-neutral-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                          {item.type === "COMPANY" ? (
                            <Building2 className="h-5 w-5 text-neutral-500" />
                          ) : (
                            <User className="h-5 w-5 text-neutral-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{item.name}</p>
                          <p className="text-[11px] text-neutral-400 font-medium">ID: {item.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                        item.type === "COMPANY" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                      )}>
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-neutral-700">
                          {new Date(item.date).toLocaleDateString("en-NG", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {new Date(item.date).toLocaleTimeString("en-NG", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          item.risk === "HIGH" ? "bg-danger-500" : 
                          item.risk === "MEDIUM" ? "bg-warning-500" : "bg-success-500"
                        )} />
                        <span className="text-xs font-bold text-neutral-700">{item.risk}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4 text-neutral-500" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-success-600">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve KYC
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-danger-600">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject / Flag
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-neutral-500">
                    No items found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
