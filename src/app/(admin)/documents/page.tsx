"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { 
  FileText, Search, Filter, CheckCircle2, XCircle, 
  Clock, Download, Eye, ShieldCheck, Building2, 
  Users, ChevronRight, AlertCircle, Trash2, ExternalLink
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatDate, formatFileSize } from "@/lib/format";
import { approveDocument, rejectDocument } from "@/lib/mock/handlers/documents";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import type { Document, DocumentStatus, DocumentType } from "@/lib/zod/document";

const CATEGORIES = ["ALL", "COMPANY", "INVESTOR"];
const STATUS_FILTERS: (DocumentStatus | "ALL")[] = ["ALL", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

export default function DocumentsPage() {
  const documents = useMockStore((s) => s.documents);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "ALL">("ALL");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isActioning, setIsActioning] = useState(false);
  const toast = useToast();

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                            doc.entityName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || doc.entityType === category;
      const matchesStatus = statusFilter === "ALL" || doc.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [documents, search, category, statusFilter]);

  const handleApprove = async (id: string) => {
    setIsActioning(true);
    const res = await approveDocument(id);
    setIsActioning(false);
    if (res.ok) {
      toast.success("Document Approved", "The document has been verified.");
      setSelectedDoc(null);
    } else toast.error("Failed", res.error);
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    setIsActioning(true);
    const res = await rejectDocument(id, reason);
    setIsActioning(false);
    if (res.ok) {
      toast.success("Document Rejected", "Investor/Company will be notified.");
      setSelectedDoc(null);
    } else toast.error("Failed", res.error);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Document Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Review and manage verification documents for all entities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-100 rounded-lg p-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={cn("px-3 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all",
                  category === c ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                )}>{c}s</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search documents or entities..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap",
                statusFilter === s ? "bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/20" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
              )}>
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List Table */}
        <motion.div className="lg:col-span-8 rounded-2xl border border-neutral-200 bg-surface overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-100">
                  <th className="text-left py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Document</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Entity</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Uploaded</th>
                  <th className="text-center py-4 px-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((doc) => (
                  <tr key={doc.id} className={cn("group hover:bg-neutral-50/50 transition-colors cursor-pointer", selectedDoc?.id === doc.id && "bg-brand-50/30")} onClick={() => setSelectedDoc(doc)}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-brand-500 transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{doc.name}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wider font-medium">{doc.type.replace(/_/g, " ")} • {formatFileSize(doc.fileSize)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {doc.entityType === "COMPANY" ? <Building2 className="h-3 w-3 text-brand-500" /> : <Users className="h-3 w-3 text-brand-500" />}
                        <span className="font-medium text-neutral-600">{doc.entityName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6"><StatusBadge status={doc.status} /></td>
                    <td className="py-4 px-6 text-right text-neutral-400 text-xs">{formatDate(doc.uploadedAt)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"><Download className="h-4 w-4" /></button>
                        <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"><Eye className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-neutral-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No documents found matching filters</p>
            </div>
          )}
        </motion.div>

        {/* Preview Panel */}
        <div className="lg:col-span-4 h-full">
          <AnimatePresence mode="wait">
            {selectedDoc ? (
              <motion.div key={selectedDoc.id} className="sticky top-6 rounded-3xl border border-neutral-200 bg-surface shadow-xl flex flex-col overflow-hidden h-[calc(100vh-140px)]"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Document Review</h3>
                  <button onClick={() => setSelectedDoc(null)} className="text-neutral-400 hover:text-neutral-600"><XCircle className="h-5 w-5" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* File Mock Preview */}
                  <div className="aspect-[3/4] rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col items-center justify-center text-neutral-400 space-y-3 relative group overflow-hidden">
                    <FileText className="h-16 w-16 opacity-20 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-bold opacity-40">{selectedDoc.name}</p>
                    <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="h-10 px-4 rounded-lg bg-white text-neutral-900 text-xs font-bold flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" /> Open Full File
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Details</h4>
                      <p className="text-sm font-bold text-neutral-900">{selectedDoc.type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-neutral-500 mt-1">{selectedDoc.entityName} • {selectedDoc.entityType}</p>
                    </div>
                    {selectedDoc.rejectionReason && (
                      <div className="p-3 rounded-xl bg-danger-50 border border-danger-100">
                        <p className="text-[10px] font-bold text-danger-600 uppercase tracking-widest mb-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Rejection Reason</p>
                        <p className="text-xs text-danger-700 leading-relaxed">{selectedDoc.rejectionReason}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-50">
                      <div>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Size</p>
                        <p className="text-xs font-medium text-neutral-900">{formatFileSize(selectedDoc.fileSize)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Uploaded</p>
                        <p className="text-xs font-medium text-neutral-900">{formatDate(selectedDoc.uploadedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDoc.status === "PENDING" || selectedDoc.status === "UNDER_REVIEW" ? (
                  <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 grid grid-cols-2 gap-3">
                    <button onClick={() => handleApprove(selectedDoc.id)} disabled={isActioning}
                      className="h-11 rounded-xl bg-success-500 text-white text-xs font-bold hover:bg-success-600 transition-all active:scale-95 disabled:opacity-50">Approve</button>
                    <button onClick={() => handleReject(selectedDoc.id)} disabled={isActioning}
                      className="h-11 rounded-xl border border-danger-200 bg-white text-danger-600 text-xs font-bold hover:bg-danger-50 transition-all active:scale-95 disabled:opacity-50">Reject</button>
                  </div>
                ) : (
                  <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
                    <div className={cn("rounded-xl p-3 flex items-center justify-center gap-2", 
                      selectedDoc.status === "APPROVED" ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700")}>
                      {selectedDoc.status === "APPROVED" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      <span className="text-xs font-bold uppercase tracking-wider">{selectedDoc.status}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="h-full rounded-3xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                <div className="h-16 w-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 opacity-20" />
                </div>
                <p className="text-sm font-medium">Select a document to preview and take action</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
