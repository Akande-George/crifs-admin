import type { AuditAction, AuditEntry } from "@/lib/zod/audit";
import type { Admin } from "@/lib/zod/admin";
import { useMockStore } from "../store";

/**
 * Write an entry to the simulated audit log.
 * Every mutation handler must call this.
 */
export function writeAuditLog({
  action,
  actor,
  entityId = null,
  entityType = null,
  entityName = null,
  metadata = null,
}: {
  action: AuditAction;
  actor: Admin;
  entityId?: string | null;
  entityType?: string | null;
  entityName?: string | null;
  metadata?: Record<string, unknown> | null;
}): AuditEntry {
  const entry: AuditEntry = {
    id: crypto.randomUUID(),
    action,
    actorId: actor.id,
    actorName: `${actor.firstName} ${actor.lastName}`,
    actorRole: actor.role,
    entityId,
    entityType,
    entityName,
    metadata,
    ipAddress: "192.168.1.1",
    timestamp: new Date().toISOString(),
  };

  useMockStore.getState().addAuditEntry(entry);
  return entry;
}
