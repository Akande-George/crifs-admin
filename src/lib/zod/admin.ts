import { z } from "zod";

/* ─── Admin / Roles ─── */

export const RoleSchema = z.enum([
  "SUPER_ADMIN",
  "COMPLIANCE_OFFICER",
  "INVESTMENT_MANAGER",
  "SUPPORT_AGENT",
  "FINANCE_OFFICER",
]);

export const AdminSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: RoleSchema,
  avatarUrl: z.string().url().nullable(),
  isActive: z.boolean(),
  lastLoginAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export type Role = z.infer<typeof RoleSchema>;
export type Admin = z.infer<typeof AdminSchema>;
