import type { Document, DocumentStatus } from "@/lib/zod/document";
import { useMockStore } from "../store";
import { writeAuditLog } from "../audit/writeAuditLog";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string; code: string };

function simulateLatency(): Promise<void> {
  return new Promise((r) => setTimeout(r, 150 + Math.random() * 450));
}

export async function approveDocument(id: string): Promise<ActionResult<void>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const doc = store.documents.find((d) => d.id === id);
  if (!doc) return { ok: false, error: "Document not found", code: "NOT_FOUND" };

  store.updateDocument(id, {
    status: "APPROVED",
    reviewedBy: `${store.currentAdmin.firstName} ${store.currentAdmin.lastName}`,
    reviewedAt: new Date().toISOString(),
    rejectionReason: null,
  });

  writeAuditLog({
    action: "DOCUMENT_APPROVED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: doc.entityType === "COMPANY" ? "COMPANY" : "INVESTOR",
    entityName: doc.name,
    metadata: { docType: doc.type, entityName: doc.entityName },
  });

  return { ok: true, data: undefined };
}

export async function rejectDocument(id: string, reason: string): Promise<ActionResult<void>> {
  await simulateLatency();
  const store = useMockStore.getState();
  const doc = store.documents.find((d) => d.id === id);
  if (!doc) return { ok: false, error: "Document not found", code: "NOT_FOUND" };

  store.updateDocument(id, {
    status: "REJECTED",
    reviewedBy: `${store.currentAdmin.firstName} ${store.currentAdmin.lastName}`,
    reviewedAt: new Date().toISOString(),
    rejectionReason: reason,
  });

  writeAuditLog({
    action: "DOCUMENT_REJECTED",
    actor: store.currentAdmin,
    entityId: id,
    entityType: doc.entityType === "COMPANY" ? "COMPANY" : "INVESTOR",
    entityName: doc.name,
    metadata: { docType: doc.type, entityName: doc.entityName, reason },
  });

  return { ok: true, data: undefined };
}
