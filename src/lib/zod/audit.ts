import { z } from "zod";

/* ─── Audit Log ─── */

export const AuditActionSchema = z.enum([
  "COMPANY_APPROVED",
  "COMPANY_REJECTED",
  "COMPANY_SUSPENDED",
  "INVESTOR_ACCREDITED",
  "INVESTOR_REJECTED",
  "FUNDING_APPROVED",
  "FUNDING_REJECTED",
  "FUNDING_DISBURSED",
  "DOCUMENT_APPROVED",
  "DOCUMENT_REJECTED",
  "VOTE_CAST",
  "VOTE_OVERRIDDEN",
  "ROLE_CHANGED",
  "CONFIG_UPDATED",
  "NOTIFICATION_SENT",
  "ADMIN_LOGIN",
  "ADMIN_LOGOUT",
]);

export const AuditEntrySchema = z.object({
  id: z.string().uuid(),
  action: AuditActionSchema,
  actorId: z.string().uuid(),
  actorName: z.string(),
  actorRole: z.string(),
  entityId: z.string().uuid().nullable(),
  entityType: z.string().nullable(),
  entityName: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  ipAddress: z.string().nullable(),
  timestamp: z.string().datetime(),
});

export type AuditAction = z.infer<typeof AuditActionSchema>;
export type AuditEntry = z.infer<typeof AuditEntrySchema>;
