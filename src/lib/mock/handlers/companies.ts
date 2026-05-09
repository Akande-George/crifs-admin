import type { Company, CompanyStatus } from "@/lib/zod/company";
import { useMockStore } from "../store";
import { writeAuditLog } from "../audit/writeAuditLog";

/* ─── Helpers ─── */

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string; code: string };

/** Simulate async latency (150–600ms) */
function simulateLatency(): Promise<void> {
  const delay = 150 + Math.random() * 450;
  return new Promise((r) => setTimeout(r, delay));
}

/* ─── Handlers ─── */

export async function getCompanies(): Promise<Company[]> {
  await simulateLatency();
  return useMockStore.getState().companies;
}

export async function getCompanyById(id: string): Promise<ActionResult<Company>> {
  await simulateLatency();
  const company = useMockStore.getState().companies.find((c) => c.id === id);
  if (!company) return { ok: false, error: "Company not found", code: "NOT_FOUND" };
  return { ok: true, data: company };
}

export async function approveCompany(id: string): Promise<ActionResult<Company>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const company = store.companies.find((c) => c.id === id);
  if (!company) return { ok: false, error: "Company not found", code: "NOT_FOUND" };

  const updatedCompany: Partial<Company> = {
    status: "ACTIVE" as CompanyStatus,
    lastActivityAt: new Date().toISOString(),
  };

  store.updateCompany(id, updatedCompany);

  writeAuditLog({
    action: "COMPANY_APPROVED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: "COMPANY",
    entityName: company.name,
  });

  return { ok: true, data: { ...company, ...updatedCompany, updatedAt: new Date().toISOString() } };
}

export async function rejectCompany(id: string, reason?: string): Promise<ActionResult<Company>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const company = store.companies.find((c) => c.id === id);
  if (!company) return { ok: false, error: "Company not found", code: "NOT_FOUND" };

  const updatedCompany: Partial<Company> = {
    status: "REJECTED" as CompanyStatus,
    lastActivityAt: new Date().toISOString(),
  };

  store.updateCompany(id, updatedCompany);

  writeAuditLog({
    action: "COMPANY_REJECTED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: "COMPANY",
    entityName: company.name,
    metadata: reason ? { reason } : null,
  });

  return { ok: true, data: { ...company, ...updatedCompany, updatedAt: new Date().toISOString() } };
}

export async function suspendCompany(id: string, reason?: string): Promise<ActionResult<Company>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const company = store.companies.find((c) => c.id === id);
  if (!company) return { ok: false, error: "Company not found", code: "NOT_FOUND" };

  const updatedCompany: Partial<Company> = {
    status: "SUSPENDED" as CompanyStatus,
    lastActivityAt: new Date().toISOString(),
  };

  store.updateCompany(id, updatedCompany);

  writeAuditLog({
    action: "COMPANY_SUSPENDED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: "COMPANY",
    entityName: company.name,
    metadata: reason ? { reason } : null,
  });

  return { ok: true, data: { ...company, ...updatedCompany, updatedAt: new Date().toISOString() } };
}
