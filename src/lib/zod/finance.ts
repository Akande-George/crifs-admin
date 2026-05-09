import { z } from "zod";

export const TransactionTypeSchema = z.enum(["DISBURSEMENT", "REPAYMENT", "PLATFORM_FEE", "INVESTMENT"]);

export const TransactionStatusSchema = z.enum(["PENDING", "COMPLETED", "FAILED", "PROCESSING"]);

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  type: TransactionTypeSchema,
  amount: z.number().positive(),
  currency: z.string().default("NGN"),
  status: TransactionStatusSchema,
  entityId: z.string().uuid(), // company or investor ID
  entityName: z.string(),
  referenceId: z.string().uuid().nullable(), // e.g. fundingRequestId
  referenceType: z.string().nullable(),
  description: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});

export type TransactionType = z.infer<typeof TransactionTypeSchema>;
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
