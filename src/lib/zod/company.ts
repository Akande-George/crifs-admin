import { z } from "zod";

/* ─── Company ─── */

export const CompanyStatusSchema = z.enum([
  "PENDING_REVIEW",
  "KYC_IN_PROGRESS",
  "ACTIVE",
  "SUSPENDED",
  "REJECTED",
]);

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  rcNumber: z.string(),
  industry: z.string(),
  state: z.string(),
  city: z.string(),
  address: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().email(),
  website: z.string().url().nullable(),
  logoUrl: z.string().url().nullable(),
  status: CompanyStatusSchema,
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  kycScore: z.number().min(0).max(100).nullable(),
  totalFundingRaised: z.number().nonnegative(),
  activeFundingRequests: z.number().int().nonnegative(),
  directorNames: z.array(z.string()),
  incorporationDate: z.string().datetime(),
  lastActivityAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CompanyStatus = z.infer<typeof CompanyStatusSchema>;
export type Company = z.infer<typeof CompanySchema>;
