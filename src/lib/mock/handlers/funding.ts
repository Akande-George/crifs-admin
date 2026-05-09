import type { FundingRequest, PipelineStage } from "@/lib/zod/funding";
import { useMockStore } from "../store";
import { writeAuditLog } from "../audit/writeAuditLog";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string; code: string };

function simulateLatency(): Promise<void> {
  return new Promise((r) => setTimeout(r, 150 + Math.random() * 450));
}

export async function getFundingRequests(): Promise<FundingRequest[]> {
  await simulateLatency();
  return useMockStore.getState().fundingRequests;
}

export async function getFundingRequestById(id: string): Promise<ActionResult<FundingRequest>> {
  await simulateLatency();
  const fr = useMockStore.getState().fundingRequests.find((f) => f.id === id);
  if (!fr) return { ok: false, error: "Funding request not found", code: "NOT_FOUND" };
  return { ok: true, data: fr };
}

export async function approveFunding(id: string, amountApproved?: number): Promise<ActionResult<FundingRequest>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const fr = store.fundingRequests.find((f) => f.id === id);
  if (!fr) return { ok: false, error: "Funding request not found", code: "NOT_FOUND" };

  const patch: Partial<FundingRequest> = {
    stage: "APPROVED" as PipelineStage,
    amountApproved: amountApproved ?? fr.amountRequested,
    approvedAt: new Date().toISOString(),
  };
  store.updateFundingRequest(id, patch);

  writeAuditLog({
    action: "FUNDING_APPROVED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: "FUNDING_REQUEST",
    entityName: fr.title,
    metadata: { companyName: fr.companyName, amount: patch.amountApproved },
  });

  return { ok: true, data: { ...fr, ...patch, updatedAt: new Date().toISOString() } };
}

export async function rejectFunding(id: string, reason?: string): Promise<ActionResult<FundingRequest>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const fr = store.fundingRequests.find((f) => f.id === id);
  if (!fr) return { ok: false, error: "Funding request not found", code: "NOT_FOUND" };

  const patch: Partial<FundingRequest> = {
    stage: "REJECTED" as PipelineStage,
    reviewedAt: new Date().toISOString(),
  };
  store.updateFundingRequest(id, patch);

  writeAuditLog({
    action: "FUNDING_REJECTED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: "FUNDING_REQUEST",
    entityName: fr.title,
    metadata: reason ? { reason, companyName: fr.companyName } : { companyName: fr.companyName },
  });

  return { ok: true, data: { ...fr, ...patch, updatedAt: new Date().toISOString() } };
}

export async function disburseFunding(id: string, amount: number): Promise<ActionResult<FundingRequest>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const fr = store.fundingRequests.find((f) => f.id === id);
  if (!fr) return { ok: false, error: "Funding request not found", code: "NOT_FOUND" };

  const patch: Partial<FundingRequest> = {
    stage: "DISBURSEMENT" as PipelineStage,
    amountDisbursed: fr.amountDisbursed + amount,
    disbursedAt: new Date().toISOString(),
  };
  store.updateFundingRequest(id, patch);

  writeAuditLog({
    action: "FUNDING_DISBURSED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: "FUNDING_REQUEST",
    entityName: fr.title,
    metadata: { amount, companyName: fr.companyName },
  });

  return { ok: true, data: { ...fr, ...patch, updatedAt: new Date().toISOString() } };
}
