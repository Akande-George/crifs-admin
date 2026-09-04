"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Building2,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { KycProgressBar } from "@/components/molecules/KycProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useAdminCompanies,
  useAdminUsers,
  useApproveCompanyKyc,
  useApproveUserKyc,
  useRejectCompanyKyc,
  useRejectUserKyc,
} from "@/lib/hooks/api/useAdmin";
import type { KycProgressSummary, KycStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type Type = "COMPANY" | "INVESTOR";
type Row = {
  id: string;
  name: string;
  type: Type;
  status: string;
  date: string;
  progress: KycProgressSummary;
};

const STATUS_FILTERS = ["ALL", "PENDING", "UNVERIFIED", "VERIFIED", "REJECTED"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function KYCQueuePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // Fetch pending investors + pending companies concurrently. Backend
  // handles pagination server-side; page size chosen to comfortably cover
  // one screenful with room for filtering.
  // The status filter drives the query, not just a client-side pass. Pinning
  // both fetches to PENDING (as this page used to) meant selecting Verified or
  // Rejected always rendered an empty table.
  const kycStatus =
    statusFilter === "ALL" ? undefined : (statusFilter as KycStatus);
  const investorsQuery = useAdminUsers({
    role: "INVESTOR",
    kycStatus,
    perPage: 100,
  });
  const companiesQuery = useAdminCompanies({
    kycStatus,
    perPage: 100,
  });

  const approveUser = useApproveUserKyc();
  const rejectUser = useRejectUserKyc();
  const approveCompany = useApproveCompanyKyc();
  const rejectCompany = useRejectCompanyKyc();

  const rows = useMemo<Row[]>(() => {
    const investors = (investorsQuery.data?.data ?? []).map<Row>((u) => ({
      id: u.id,
      name: u.name,
      type: "INVESTOR",
      status: u.kycStatus,
      date: u.createdAt,
      progress: u.kycProgress,
    }));
    const companies = (companiesQuery.data?.data ?? []).map<Row>((c) => ({
      id: c.id,
      name: c.name,
      type: "COMPANY",
      status: c.kycStatus,
      date: c.createdAt,
      progress: c.kycProgress,
    }));
    return [...investors, ...companies].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [investorsQuery.data, companiesQuery.data]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((r) => {
      return !q || r.name.toLowerCase().includes(q);
    });
  }, [rows, searchQuery]);

  const isLoading = investorsQuery.isLoading || companiesQuery.isLoading;

  const handleApprove = (row: Row) => {
    const notes = window.prompt("Approval notes (visible in audit log)?");
    if (!notes) return;
    if (row.type === "INVESTOR")
      approveUser.mutate({ userId: row.id, notes });
    else approveCompany.mutate({ companyId: row.id, notes });
  };
  const handleReject = (row: Row) => {
    const notes = window.prompt("Rejection reason?");
    if (!notes) return;
    if (row.type === "INVESTOR")
      rejectUser.mutate({ userId: row.id, notes });
    else rejectCompany.mutate({ companyId: row.id, notes });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            KYC Queue
          </h1>
          <p className="text-sm text-neutral-500">
            Monitor and approve pending identity verifications
          </p>
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
              Status: {statusFilter === "ALL" ? "All" : statusFilter}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {STATUS_FILTERS.map((f) => (
                <DropdownMenuItem key={f} onClick={() => setStatusFilter(f)}>
                  {f === "ALL"
                    ? "All"
                    : f.charAt(0) + f.slice(1).toLowerCase()}
                </DropdownMenuItem>
              ))}
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
                <TableHead className="hidden sm:table-cell w-[200px]">
                  Level progress
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Submission Date
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-neutral-500"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : filteredRows.length > 0 ? (
                filteredRows.map((item) => (
                  <TableRow key={`${item.type}:${item.id}`} className="hover:bg-neutral-50/50">
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
                          <p className="text-sm font-bold text-neutral-900">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-medium">
                            ID: {item.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                          item.type === "COMPANY"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700",
                        )}
                      >
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <KycProgressBar progress={item.progress} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-neutral-700">
                          {new Date(item.date).toLocaleDateString("en-NG", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {new Date(item.date).toLocaleTimeString("en-NG", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Plain Link, not <Button asChild> — this Button is
                            base-ui, which has no asChild slot. */}
                        <Link
                          href={
                            item.type === "COMPANY"
                              ? `/companies/${item.id}`
                              : `/investors/${item.id}`
                          }
                          aria-label={`Open ${item.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-success-600"
                              onClick={() => handleApprove(item)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve KYC
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-danger-600"
                              onClick={() => handleReject(item)}
                            >
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
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-neutral-500"
                  >
                    No pending verifications.
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
