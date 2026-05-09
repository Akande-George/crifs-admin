"use client";

import { use, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { 
  ArrowLeft, Vote, Clock, CheckCircle2, XCircle, 
  MessageSquare, Users, ShieldCheck, AlertCircle, 
  ChevronRight, Building2, Gavel
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { RoleGuardedAction } from "@/components/organisms/RoleGuardedAction";
import { formatNaira, formatPercent, formatDate, formatRelativeTime } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import { castVote, overrideVotingRound } from "@/lib/mock/handlers/voting";
import { cn } from "@/lib/utils";
import type { VoteValue } from "@/lib/zod/voting";

export default function VotingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const votingRounds = useMockStore((s) => s.votingRounds);
  const currentAdmin = useMockStore((s) => s.currentAdmin);
  const round = votingRounds.find((r) => r.id === id);
  const [isCasting, setIsCasting] = useState(false);
  const [comment, setComment] = useState("");
  const toast = useToast();

  const myVote = useMemo(() => round?.votes.find(v => v.voterId === currentAdmin.id), [round, currentAdmin]);
  const approvals = useMemo(() => round?.votes.filter(v => v.value === "APPROVE").length || 0, [round]);
  const rejections = useMemo(() => round?.votes.filter(v => v.value === "REJECT").length || 0, [round]);
  const abstains = useMemo(() => round?.votes.filter(v => v.value === "ABSTAIN").length || 0, [round]);
  
  const approvalPct = round?.votes.length ? (approvals / round.votes.length) * 100 : 0;

  if (!round) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 mb-4"><Vote className="h-8 w-8 text-neutral-400" /></div>
        <h2 className="text-lg font-semibold text-neutral-900">Voting round not found</h2>
        <Link href="/voting" className="mt-4 text-sm text-brand-500 font-medium">← Back to voting</Link>
      </div>
    );
  }

  const handleVote = async (value: VoteValue) => {
    setIsCasting(true);
    const result = await castVote(round.id, value, comment);
    setIsCasting(false);
    if (result.ok) {
      toast.success("Vote cast successfully", `You voted to ${value.toLowerCase()}`);
      setComment("");
    } else {
      toast.error("Failed to cast vote", result.error);
    }
  };

  const handleOverride = async (result: "APPROVED" | "REJECTED") => {
    const reason = window.prompt("Enter reason for override:");
    if (!reason) return;
    
    setIsCasting(true);
    const res = await overrideVotingRound(round.id, result, reason);
    setIsCasting(false);
    if (res.ok) toast.success("Override successful", `Round has been ${result.toLowerCase()}`);
    else toast.error("Override failed", res.error);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/voting" className="flex items-center gap-1 text-neutral-500 hover:text-neutral-700 transition-colors"><ArrowLeft className="h-4 w-4" />Governance</Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-medium truncate">{round.requestTitle}</span>
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{round.requestTitle}</h1>
            <StatusBadge status={round.status} size="md" />
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1.5 font-medium text-neutral-700"><Building2 className="h-4 w-4 text-brand-500" /> {round.companyName}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand-500" /> Started {formatDate(round.startedAt)}</span>
            <span className="flex items-center gap-1.5 text-danger-500 font-medium"><AlertCircle className="h-4 w-4" /> Ends {formatRelativeTime(round.endsAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/funding/${round.fundingRequestId}`} className="h-9 px-4 flex items-center justify-center rounded-lg border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">
            View Proposal Details
          </Link>
          <RoleGuardedAction action="voting:override">
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
              <button onClick={() => handleOverride("APPROVED")} className="h-7 px-3 text-[10px] font-bold text-success-600 hover:bg-white rounded transition-all">Override Approve</button>
              <button onClick={() => handleOverride("REJECTED")} className="h-7 px-3 text-[10px] font-bold text-danger-600 hover:bg-white rounded transition-all">Override Reject</button>
            </div>
          </RoleGuardedAction>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Voting Interface */}
          {round.status === "IN_PROGRESS" && !myVote && (
            <motion.div className="rounded-3xl border-2 border-brand-500/20 bg-brand-50/10 p-8 space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3">
                <Gavel className="h-6 w-6 text-brand-500" />
                <h3 className="text-lg font-bold text-neutral-900">Cast Your Decision</h3>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
                Please review the funding proposal details, AI risk assessment, and compliance reports before casting your vote. 
                Your decision will contribute to the final approval threshold.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 block">Optional Comment</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Provide rationale for your decision..."
                    className="w-full h-24 rounded-2xl border border-neutral-200 bg-surface p-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleVote("APPROVE")} disabled={isCasting}
                    className="flex-1 h-12 rounded-xl bg-success-500 text-white font-bold hover:bg-success-600 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-success-500/20">
                    Approve
                  </button>
                  <button onClick={() => handleVote("REJECT")} disabled={isCasting}
                    className="flex-1 h-12 rounded-xl bg-danger-500 text-white font-bold hover:bg-danger-600 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-danger-500/20">
                    Reject
                  </button>
                  <button onClick={() => handleVote("ABSTAIN")} disabled={isCasting}
                    className="h-12 px-6 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-all disabled:opacity-50">
                    Abstain
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {myVote && (
            <div className="rounded-3xl border border-neutral-200 bg-surface p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", 
                  myVote.value === "APPROVE" ? "bg-success-50 text-success-600" : 
                  myVote.value === "REJECT" ? "bg-danger-50 text-danger-600" : "bg-neutral-100 text-neutral-500")}>
                  {myVote.value === "APPROVE" ? <CheckCircle2 className="h-6 w-6" /> : myVote.value === "REJECT" ? <XCircle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Your Vote</p>
                  <p className="text-lg font-bold text-neutral-900">{myVote.value}ED</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400">Cast {formatDate(myVote.votedAt)}</p>
                {myVote.comment && <p className="text-sm text-neutral-600 mt-1 italic">"{myVote.comment}"</p>}
              </div>
            </div>
          )}

          {round.status === "COMPLETED" && (
            <div className={cn("rounded-3xl p-8 flex flex-col items-center text-center space-y-4 shadow-xl", 
              round.result === "APPROVED" ? "bg-success-500 text-white shadow-success-500/20" : "bg-danger-500 text-white shadow-danger-500/20")}>
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                {round.result === "APPROVED" ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Voting Round {round.result}</h3>
                <p className="text-white/80 font-medium mt-1">Completed on {formatDate(round.completedAt!)}</p>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-8 w-full max-w-sm border-t border-white/20">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Total Votes</p>
                  <p className="text-xl font-bold">{round.votes.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Approval Pct</p>
                  <p className="text-xl font-bold">{formatPercent(approvalPct, 0)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Voter List/Activity */}
          <div className="rounded-3xl border border-neutral-200 bg-surface overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Voting Activity</h3>
              <span className="text-xs font-bold text-neutral-400">{round.votes.length} Votes Cast</span>
            </div>
            <div className="divide-y divide-neutral-100">
              {round.votes.map((v, i) => (
                <motion.div key={v.id} className="p-6 flex items-start gap-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                    {v.voterName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-neutral-900">{v.voterName} <span className="text-[10px] text-neutral-400 font-medium ml-1">({v.voterRole.replace(/_/g, " ")})</span></p>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", 
                        v.value === "APPROVE" ? "bg-success-50 text-success-600" : 
                        v.value === "REJECT" ? "bg-danger-50 text-danger-600" : "bg-neutral-100 text-neutral-500")}>
                        {v.value}
                      </span>
                    </div>
                    {v.comment && <p className="text-sm text-neutral-600 leading-relaxed">{v.comment}</p>}
                    <p className="text-[10px] text-neutral-400 pt-1">{formatDate(v.votedAt)}</p>
                  </div>
                </motion.div>
              ))}
              {round.votes.length === 0 && (
                <div className="p-12 text-center text-neutral-400">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-medium">No votes cast yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Stats Card */}
          <div className="rounded-3xl border border-neutral-200 bg-surface p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Live Results</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative h-32 w-32">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#22C55E" strokeWidth="8" strokeDasharray={`${(approvals / round.requiredVotes) * 276} 276`} strokeLinecap="round" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#EF4444" strokeWidth="8" strokeDasharray={`${(rejections / round.requiredVotes) * 276} 276`} strokeDashoffset={-(approvals / round.requiredVotes) * 276} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-neutral-900">{round.votes.length}</span>
                    <span className="text-[10px] font-bold text-neutral-400">OF {round.requiredVotes}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Approvals", count: approvals, color: "bg-success-500" },
                  { label: "Rejections", count: rejections, color: "bg-danger-500" },
                  { label: "Abstentions", count: abstains, color: "bg-neutral-300" },
                  { label: "Pending", count: Math.max(0, round.requiredVotes - round.votes.length), color: "bg-neutral-100 border border-neutral-200" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                      <span className="text-neutral-500">{item.label}</span>
                    </div>
                    <span className="text-neutral-900">{item.count}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-neutral-100 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Approval Threshold</p>
                  <p className="text-sm font-bold text-neutral-900">{round.approvalThreshold}%</p>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden relative">
                  <div className="absolute left-[60%] top-0 h-full w-0.5 bg-brand-500 z-10 shadow-[0_0_8px_rgba(var(--brand-500),0.5)]" />
                  <div className="h-full bg-success-500 transition-all duration-1000" style={{ width: `${approvalPct}%` }} />
                </div>
                <p className="text-[10px] text-neutral-400 text-center font-medium">Requires {Math.ceil((round.requiredVotes * round.approvalThreshold) / 100)} approvals to pass</p>
              </div>
            </div>
          </div>

          {/* Proposal Summary */}
          <div className="rounded-3xl border border-neutral-200 bg-surface p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Proposal Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400"><DollarSign className="h-5 w-5" /></div>
                <div><p className="text-xs text-neutral-500">Requested Amount</p><p className="text-sm font-bold text-neutral-900">{formatNaira(round.amountRequested)}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400"><Building2 className="h-5 w-5" /></div>
                <div><p className="text-xs text-neutral-500">Entity</p><p className="text-sm font-bold text-neutral-900">{round.companyName}</p></div>
              </div>
            </div>
            <Link href={`/funding/${round.fundingRequestId}`} className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-neutral-100 text-sm font-bold text-neutral-700 hover:bg-neutral-200 transition-colors">
              Full Proposal <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons
function DollarSign(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  );
}
