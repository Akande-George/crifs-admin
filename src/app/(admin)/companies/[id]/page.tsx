"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Mail,
} from "lucide-react";
import {
  useAdminCompany,
  useApproveCompanyKyc,
  useRejectCompanyKyc,
} from "@/lib/hooks/api/useAdmin";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "directors", label: "Directors", icon: Users },
  { id: "verifications", label: "Verifications", icon: ShieldCheck },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: company, isLoading, isError } = useAdminCompany(id);
  const approve = useApproveCompanyKyc();
  const reject = useRejectCompanyKyc();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4">
          <Building2 className="h-8 w-8 text-neutral-400" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Company not found
        </h2>
        <Link
          href="/companies"
          className="mt-4 text-sm text-brand-500 hover:text-brand-600 font-medium"
        >
          ← Back to companies
        </Link>
      </div>
    );
  }

  const canReview = company.kycStatus === "PENDING";

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({
        companyId: company.id,
        notes: "Approved via admin dashboard",
      });
      toast.success("Company approved", `${company.name} is now verified`);
    } catch (e) {
      toast.error(
        "Failed",
        (e as { message?: string })?.message ?? "Could not approve",
      );
    }
  };

  const handleReject = async () => {
    try {
      await reject.mutateAsync({
        companyId: company.id,
        notes: "Rejected via admin dashboard",
      });
      toast.success("Company rejected", `${company.name} was rejected`);
    } catch (e) {
      toast.error(
        "Failed",
        (e as { message?: string })?.message ?? "Could not reject",
      );
    }
  };

  const busy = approve.isPending || reject.isPending;

  return (
    <div className="space-y-6">
      <Link
        href="/companies"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to companies
      </Link>

      <div className="rounded-2xl border border-neutral-200 bg-surface p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-500 font-semibold">
              {company.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
                {company.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1 flex-wrap">
                {company.rcNumber && <span>RC {company.rcNumber}</span>}
                {company.tin && <span>TIN {company.tin}</span>}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Created{" "}
                  {formatRelativeTime(company.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={company.kycStatus} size="md" />
            {canReview && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-success-500 text-white text-xs font-medium hover:bg-success-600 disabled:opacity-50 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-danger-500 text-white text-xs font-medium hover:bg-danger-600 disabled:opacity-50 transition-colors"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-200 flex items-center gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === t.id
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-neutral-500 hover:text-neutral-800",
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === "overview" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-surface p-5">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Owner
                </p>
                {company.owner ? (
                  <div className="mt-3 space-y-1">
                    <p className="font-medium text-neutral-900">
                      {company.owner.name}
                    </p>
                    <p className="text-sm text-neutral-500 inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {company.owner.email}
                    </p>
                    <div className="pt-2">
                      <StatusBadge status={company.owner.kycStatus} />
                    </div>
                    <Link
                      href={`/investors/${company.owner.id}`}
                      className="inline-block mt-3 text-xs text-brand-500 hover:text-brand-600"
                    >
                      View owner profile →
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400 mt-3">No owner</p>
                )}
              </div>

              <div className="rounded-xl border border-neutral-200 bg-surface p-5">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Records
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Directors</span>
                    <span className="font-medium text-neutral-900">
                      {company.directors.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Verifications</span>
                    <span className="font-medium text-neutral-900">
                      {company.verifications.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Last updated</span>
                    <span className="text-neutral-700">
                      {formatDate(company.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "directors" && (
            <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
              {company.directors.length === 0 ? (
                <p className="text-sm text-neutral-400 p-8 text-center">
                  No directors recorded.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50/80">
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Rep
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {company.directors.map((d) => (
                      <tr key={d.id}>
                        <td className="py-3 px-4 font-medium text-neutral-800">
                          {d.fullName}
                        </td>
                        <td className="hidden md:table-cell py-3 px-4 text-neutral-600">
                          {d.role ?? "—"}
                        </td>
                        <td className="py-3 px-4 text-neutral-600 text-xs">
                          <div>{d.email ?? "—"}</div>
                          <div className="text-neutral-400">
                            {d.phone ?? "—"}
                          </div>
                        </td>
                        <td className="hidden md:table-cell py-3 px-4 text-neutral-500 text-xs">
                          {d.isRep ? "Yes" : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "verifications" && (
            <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
              {company.verifications.length === 0 ? (
                <p className="text-sm text-neutral-400 p-8 text-center">
                  No verifications recorded.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50/80">
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {company.verifications.map((v) => (
                      <tr key={v.id}>
                        <td className="py-3 px-4 font-medium text-neutral-800">
                          {v.type}
                        </td>
                        <td className="py-3 px-4 text-neutral-600">
                          {v.provider}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={v.status} />
                        </td>
                        <td className="hidden md:table-cell py-3 px-4 text-neutral-500 text-xs">
                          {v.completedAt
                            ? formatDate(v.completedAt)
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
