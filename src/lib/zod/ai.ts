import { z } from "zod";

export const AIReviewSectionSchema = z.object({
  score: z.number().min(0).max(100),
  status: z.enum(["LOW_RISK", "MEDIUM_RISK", "HIGH_RISK"]),
  findings: z.array(z.string()),
  recommendation: z.string(),
});

export const AIReviewReportSchema = z.object({
  id: z.string().uuid(),
  fundingRequestId: z.string().uuid(),
  companyId: z.string().uuid(),
  overallScore: z.number().min(0).max(100),
  sections: z.object({
    documentQuality: AIReviewSectionSchema,
    historicalPatterns: AIReviewSectionSchema,
    cacCompliance: AIReviewSectionSchema,
    financialSanity: AIReviewSectionSchema,
    anomalyDetection: AIReviewSectionSchema,
  }),
  generatedAt: z.string().datetime(),
  version: z.string(),
});

export type AIReviewSection = z.infer<typeof AIReviewSectionSchema>;
export type AIReviewReport = z.infer<typeof AIReviewReportSchema>;
