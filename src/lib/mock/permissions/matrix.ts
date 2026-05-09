import type { Role } from "@/lib/zod/admin";

/* ─── Permission Actions ─── */

export type Action =
  | "company:read" | "company:write" | "company:approve_kyc"
  | "investor:read" | "investor:write" | "investor:approve_accreditation"
  | "funding:read" | "funding:approve" | "funding:disburse"
  | "voting:read" | "voting:override"
  | "document:approve" | "document:reject"
  | "audit:read" | "config:write" | "team:manage";

/* ─── Role → Action Matrix ─── */

export const permissionMatrix: Record<Role, Set<Action>> = {
  SUPER_ADMIN: new Set([
    "company:read", "company:write", "company:approve_kyc",
    "investor:read", "investor:write", "investor:approve_accreditation",
    "funding:read", "funding:approve", "funding:disburse",
    "voting:read", "voting:override",
    "document:approve", "document:reject",
    "audit:read", "config:write", "team:manage",
  ]),
  COMPLIANCE_OFFICER: new Set([
    "company:read", "company:write", "company:approve_kyc",
    "investor:read", "investor:write", "investor:approve_accreditation",
    "funding:read",
    "voting:read",
    "document:approve", "document:reject",
    "audit:read",
  ]),
  INVESTMENT_MANAGER: new Set([
    "company:read",
    "investor:read",
    "funding:read", "funding:approve",
    "voting:read", "voting:override",
    "document:approve", "document:reject",
    "audit:read",
  ]),
  SUPPORT_AGENT: new Set([
    "company:read",
    "investor:read",
    "funding:read",
    "voting:read",
    "audit:read",
  ]),
  FINANCE_OFFICER: new Set([
    "company:read",
    "investor:read",
    "funding:read", "funding:disburse",
    "voting:read",
    "audit:read",
  ]),
};
