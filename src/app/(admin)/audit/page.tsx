"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAudit } from "@/lib/hooks/api/useAdmin";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const PER_PAGE = 25;

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAudit({ page, perPage: PER_PAGE });
  const rows = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          Audit Log
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Every admin mutation, newest first.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50/80">
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  When
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/50">
                  <td className="py-3 px-4 text-neutral-500 text-xs whitespace-nowrap">
                    {formatDateTime(r.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-neutral-700 text-xs">
                    {r.adminEmail ?? r.adminId.slice(-6)}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-neutral-800">
                    {r.action}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={cn(
                        "text-[11px] font-medium px-2 py-0.5 rounded-full",
                        r.statusCode < 400
                          ? "bg-success-50 text-success-600"
                          : "bg-danger-50 text-danger-600",
                      )}
                    >
                      {r.statusCode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
            <p className="text-xs text-neutral-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {!isLoading && !isError && rows.length === 0 && (
        <div className="py-12 text-center text-sm text-neutral-500">
          No admin actions recorded yet.
        </div>
      )}
      {isError && (
        <div className="py-6 text-center text-sm text-danger-600">
          Failed to load audit log.
        </div>
      )}
    </div>
  );
}
