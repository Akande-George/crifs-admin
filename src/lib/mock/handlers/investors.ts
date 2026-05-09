import type { Investor, AccreditationStatus } from "@/lib/zod/investor";
import { useMockStore } from "../store";
import { writeAuditLog } from "../audit/writeAuditLog";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string; code: string };

function simulateLatency(): Promise<void> {
  return new Promise((r) => setTimeout(r, 150 + Math.random() * 450));
}

export async function getInvestors(): Promise<Investor[]> {
  await simulateLatency();
  return useMockStore.getState().investors;
}

export async function getInvestorById(id: string): Promise<ActionResult<Investor>> {
  await simulateLatency();
  const investor = useMockStore.getState().investors.find((inv) => inv.id === id);
  if (!investor) return { ok: false, error: "Investor not found", code: "NOT_FOUND" };
  return { ok: true, data: investor };
}

export async function approveAccreditation(id: string): Promise<ActionResult<Investor>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const investor = store.investors.find((inv) => inv.id === id);
  if (!investor) return { ok: false, error: "Investor not found", code: "NOT_FOUND" };

  const patch: Partial<Investor> = {
    accreditationStatus: "ACCREDITED" as AccreditationStatus,
    accreditationDate: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  };
  store.updateInvestor(id, patch);

  writeAuditLog({
    action: "INVESTOR_ACCREDITED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: "INVESTOR",
    entityName: `${investor.firstName} ${investor.lastName}`,
  });

  return { ok: true, data: { ...investor, ...patch, updatedAt: new Date().toISOString() } };
}

export async function rejectAccreditation(id: string, reason?: string): Promise<ActionResult<Investor>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const investor = store.investors.find((inv) => inv.id === id);
  if (!investor) return { ok: false, error: "Investor not found", code: "NOT_FOUND" };

  const patch: Partial<Investor> = {
    accreditationStatus: "REJECTED" as AccreditationStatus,
    lastActivityAt: new Date().toISOString(),
  };
  store.updateInvestor(id, patch);

  writeAuditLog({
    action: "INVESTOR_REJECTED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: "INVESTOR",
    entityName: `${investor.firstName} ${investor.lastName}`,
    metadata: reason ? { reason } : null,
  });

  return { ok: true, data: { ...investor, ...patch, updatedAt: new Date().toISOString() } };
}
