import { z } from "zod";

/* ─── Investor ─── */

export const AccreditationStatusSchema = z.enum([
  "PENDING",
  "IN_REVIEW",
  "ACCREDITED",
  "REJECTED",
  "EXPIRED",
]);

export const InvestorTypeSchema = z.enum([
  "INDIVIDUAL",
  "INSTITUTIONAL",
  "CORPORATE",
]);

export const InvestorSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  type: InvestorTypeSchema,
  companyName: z.string().nullable(),
  accreditationStatus: AccreditationStatusSchema,
  accreditationDate: z.string().datetime().nullable(),
  totalInvested: z.number().nonnegative(),
  activeInvestments: z.number().int().nonnegative(),
  portfolioValue: z.number().nonnegative(),
  riskTolerance: z.enum(["CONSERVATIVE", "MODERATE", "AGGRESSIVE"]),
  avatarUrl: z.string().url().nullable(),
  state: z.string(),
  city: z.string(),
  lastActivityAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AccreditationStatus = z.infer<typeof AccreditationStatusSchema>;
export type InvestorType = z.infer<typeof InvestorTypeSchema>;
export type Investor = z.infer<typeof InvestorSchema>;
