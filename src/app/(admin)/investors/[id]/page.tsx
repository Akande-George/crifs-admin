"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Mail,
  Calendar,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";
import {
  useAdminUser,
  useApproveUserKyc,
  useRejectUserKyc,
} from "@/lib/hooks/api/useAdmin";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { KycProgressCard } from "@/components/molecules/KycProgress";
import {
  formatNaira,
  formatDate,
  formatRelativeTime,
} from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: Users },
  { id: "verifications", label: "Verifications", icon: ShieldCheck },
  { id: "banks", label: "Bank Accounts", icon: Wallet },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: investor, isLoading, isError } = useAdminUser(id);
  const approve = useApproveUserKyc();
  const reject = useRejectUserKyc();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  if (isError || !investor) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4">
          <Users className="h-8 w-8 text-neutral-400" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Investor not found
        </h2>
        <Link
          href="/investors"
          className="mt-4 text-sm text-brand-500 hover:text-brand-600 font-medium"
        >
          ← Back to investors
        </Link>
      </div>
    );
  }

  const canReview = investor.kycStatus === "PENDING";
  const initials = investor.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({
        userId: investor.id,
        notes: "Approved via admin dashboard",
      });
      toast.success("KYC approved", `${investor.name} is now verified`);
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
        userId: investor.id,
        notes: "Rejected via admin dashboard",
      });
      toast.success("KYC rejected", `${investor.name} has been rejected`);
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
        href="/investors"
        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to investors
      </Link>

      <div className="rounded-2xl border border-neutral-200 bg-surface p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-500 font-semibold">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
                {investor.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {investor.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />{" "}
                  Joined {formatRelativeTime(investor.createdAt)}
                </span>
                {investor.company && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />{" "}
                    {investor.company.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={investor.kycStatus} size="md" />
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
                  Wallet
                </p>
                {investor.wallet ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">
                        Available
                      </span>
                      <span className="text-lg font-semibold text-neutral-900">
                        {formatNaira(Number(investor.wallet.available))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">Locked</span>
                      <span className="text-sm text-neutral-700">
                        {formatNaira(Number(investor.wallet.locked))}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400 mt-3">
                    No wallet yet
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-neutral-200 bg-surface p-5">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Virtual Funding Account
                </p>
                {investor.virtualAccount ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-lg font-semibold text-neutral-900 tabular-nums">
                      {investor.virtualAccount.accountNumber}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {investor.virtualAccount.bankName}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {investor.virtualAccount.accountName}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400 mt-3">
                    Not provisioned yet
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "verifications" && (
            <div className="space-y-6">
              {/* Derived server-side so the checklist always matches the rule
                  the app actually gates on. */}
              <KycProgressCard progress={investor.kycProgress} />

              <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
                <div className="border-b border-neutral-100 px-4 py-3">
                  <h3 className="text-sm font-bold text-neutral-900">
                    Check history
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Every row recorded, newest first — superseded retries
                    included. Only the latest row per type counts toward status.
                  </p>
                </div>
              {investor.verifications.length === 0 ? (
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
                    {investor.verifications.map((v) => (
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
            </div>
          )}

          {activeTab === "banks" && (
            <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
              {investor.bankAccounts.length === 0 ? (
                <p className="text-sm text-neutral-400 p-8 text-center">
                  No bank accounts on file.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50/80">
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Bank
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Default
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {investor.bankAccounts.map((b) => (
                      <tr key={b.id}>
                        <td className="py-3 px-4 text-neutral-800">
                          {b.bankName}
                        </td>
                        <td className="py-3 px-4 tabular-nums text-neutral-700">
                          {b.accountNumber}
                        </td>
                        <td className="py-3 px-4 text-neutral-600">
                          {b.accountName}
                        </td>
                        <td className="hidden md:table-cell py-3 px-4 text-neutral-500 text-xs">
                          {b.isDefault ? "Yes" : "—"}
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
