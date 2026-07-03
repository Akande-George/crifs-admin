"use client";

import { useState } from "react";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminDocuments } from "@/lib/hooks/api/useAdmin";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const KINDS = [
  "ALL",
  "PROSPECTUS",
  "CAC",
  "TAX_CERTIFICATE",
  "AUDITED_FINANCIALS",
  "OTHER",
];
const PER_PAGE = 20;

export default function DocumentsPage() {
  const [kind, setKind] = useState("ALL");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminDocuments({
    kind: kind === "ALL" ? undefined : kind,
    page,
    perPage: PER_PAGE,
  });
  const rows = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          Documents
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Every company document across the platform.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {KINDS.map((k) => (
          <button
            key={k}
            onClick={() => {
              setKind(k);
              setPage(1);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              kind === k
                ? "bg-brand-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
            )}
          >
            {k.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50/80">
              <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Document
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Company
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Kind
              </th>
              <th className="hidden md:table-cell text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Size
              </th>
              <th className="hidden md:table-cell text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Uploaded
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((d) => (
              <tr key={d.id} className="hover:bg-neutral-50/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-800">{d.filename}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-neutral-700">{d.company.name}</td>
                <td className="py-3 px-4">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                    {d.kind.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="hidden md:table-cell py-3 px-4 text-right text-neutral-500 text-xs">
                  {(d.size / 1024).toFixed(0)} KB
                </td>
                <td className="hidden md:table-cell py-3 px-4 text-neutral-500 text-xs">
                  {formatDate(d.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          No documents uploaded yet.
        </div>
      )}
    </div>
  );
}
