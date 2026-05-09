import { z } from "zod";

/* ─── Funding Request ─── */

export const PipelineStageSchema = z.enum([
  "APPLICATION",
  "DOCUMENT_REVIEW",
  "AI_ANALYSIS",
  "COMMITTEE_REVIEW",
  "APPROVED",
  "DISBURSEMENT",
  "ACTIVE",
  "COMPLETED",
  "REJECTED",
]);

export const FundCategorySchema = z.object({
  name: z.string(),
  amount: z.number().nonnegative(),
  percentage: z.number().min(0).max(100),
});

export const FundingRequestSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  companyName: z.string(),
  title: z.string().min(1),
  description: z.string(),
  amountRequested: z.number().positive(),
  amountApproved: z.number().nonnegative().nullable(),
  amountDisbursed: z.number().nonnegative(),
  stage: PipelineStageSchema,
  riskScore: z.number().min(0).max(100).nullable(),
  aiScore: z.number().min(0).max(100).nullable(),
  useOfFunds: z.array(FundCategorySchema),
  milestone: z.string(),
  interestRate: z.number().min(0).max(100).nullable(),
  tenure: z.number().int().positive().nullable(), // months
  assignedOfficer: z.string().nullable(),
  votingRoundId: z.string().uuid().nullable(),
  submittedAt: z.string().datetime(),
  reviewedAt: z.string().datetime().nullable(),
  approvedAt: z.string().datetime().nullable(),
  disbursedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PipelineStage = z.infer<typeof PipelineStageSchema>;
export type FundCategory = z.infer<typeof FundCategorySchema>;
export type FundingRequest = z.infer<typeof FundingRequestSchema>;
