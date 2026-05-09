import { z } from "zod";

/* ─── Document ─── */

export const DocumentStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
  "UNDER_REVIEW",
]);

export const DocumentTypeSchema = z.enum([
  "CAC_CERTIFICATE",
  "MEMORANDUM",
  "TAX_CLEARANCE",
  "FINANCIAL_STATEMENT",
  "BOARD_RESOLUTION",
  "PROSPECTUS",
  "IDENTITY",
  "UTILITY_BILL",
  "BANK_STATEMENT",
  "OTHER",
]);

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  entityId: z.string().uuid(), // company or investor ID
  entityType: z.enum(["COMPANY", "INVESTOR"]),
  entityName: z.string(),
  type: DocumentTypeSchema,
  name: z.string(),
  fileUrl: z.string().url(),
  fileSize: z.number().positive(), // bytes
  mimeType: z.string(),
  status: DocumentStatusSchema,
  reviewedBy: z.string().nullable(),
  reviewedAt: z.string().datetime().nullable(),
  rejectionReason: z.string().nullable(),
  expiresAt: z.string().datetime().nullable(),
  uploadedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export type Document = z.infer<typeof DocumentSchema>;
