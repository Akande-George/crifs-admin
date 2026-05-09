import type { VotingRound, Vote, VoteValue } from "@/lib/zod/voting";
import { useMockStore } from "../store";
import { writeAuditLog } from "../audit/writeAuditLog";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string; code: string };

function simulateLatency(): Promise<void> {
  return new Promise((r) => setTimeout(r, 150 + Math.random() * 450));
}

export async function getVotingRounds(): Promise<VotingRound[]> {
  await simulateLatency();
  return useMockStore.getState().votingRounds;
}

export async function getVotingRoundById(id: string): Promise<ActionResult<VotingRound>> {
  await simulateLatency();
  const round = useMockStore.getState().votingRounds.find((r) => r.id === id);
  if (!round) return { ok: false, error: "Voting round not found", code: "NOT_FOUND" };
  return { ok: true, data: round };
}

export async function castVote(roundId: string, value: VoteValue, comment?: string): Promise<ActionResult<Vote>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const round = store.votingRounds.find((r) => r.id === roundId);
  if (!round) return { ok: false, error: "Voting round not found", code: "NOT_FOUND" };

  const existingVote = round.votes.find((v) => v.voterId === store.currentAdmin.id);
  if (existingVote) return { ok: false, error: "You have already voted in this round", code: "ALREADY_VOTED" };

  const newVote: Vote = {
    id: crypto.randomUUID(),
    roundId,
    voterId: store.currentAdmin.id,
    voterName: `${store.currentAdmin.firstName} ${store.currentAdmin.lastName}`,
    voterRole: store.currentAdmin.role,
    value,
    comment: comment || null,
    votedAt: new Date().toISOString(),
  };

  store.addVote(roundId, newVote);

  writeAuditLog({
    action: "VOTE_CAST",
    actor: store.currentAdmin,
    entityId: roundId,
    entityType: "VOTING_ROUND",
    entityName: round.requestTitle,
    metadata: { value, companyName: round.companyName },
  });

  // Check if round should complete (e.g. all required votes in)
  const updatedRound = useMockStore.getState().votingRounds.find((r) => r.id === roundId)!;
  if (updatedRound.votes.length >= updatedRound.requiredVotes) {
    const approvals = updatedRound.votes.filter(v => v.value === "APPROVE").length;
    const approvalPct = (approvals / updatedRound.votes.length) * 100;
    const result = approvalPct >= updatedRound.approvalThreshold ? "APPROVED" : "REJECTED";

    store.updateVotingRound(roundId, {
      status: "COMPLETED",
      result: result as "APPROVED" | "REJECTED",
      completedAt: new Date().toISOString(),
    });

    writeAuditLog({
      action: "VOTING_ROUND_COMPLETED",
      actor: store.currentAdmin, // System actor technically, but using current admin for mock simplicity
      entityId: roundId,
      entityType: "VOTING_ROUND",
      entityName: round.requestTitle,
      metadata: { result, approvalPct },
    });
  }

  return { ok: true, data: newVote };
}

export async function overrideVotingRound(roundId: string, result: "APPROVED" | "REJECTED", reason: string): Promise<ActionResult<void>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const round = store.votingRounds.find((r) => r.id === roundId);
  if (!round) return { ok: false, error: "Voting round not found", code: "NOT_FOUND" };

  if (store.currentAdmin.role !== "SUPER_ADMIN") {
    return { ok: false, error: "Only Super Admins can override voting rounds", code: "FORBIDDEN" };
  }

  store.updateVotingRound(roundId, {
    status: "COMPLETED",
    result,
    completedAt: new Date().toISOString(),
  });

  writeAuditLog({
    action: "VOTE_OVERRIDDEN",
    actor: store.currentAdmin,
    entityId: roundId,
    entityType: "VOTING_ROUND",
    entityName: round.requestTitle,
    metadata: { result, reason, companyName: round.companyName },
  });

  return { ok: true, data: undefined };
}
