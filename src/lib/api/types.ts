import type { AdminUser } from "@/lib/auth/store";

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ── Auth ─────────────────────────────────────────────────────────────────

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

// ── Domain shapes ────────────────────────────────────────────────────────

export type Role = "INVESTOR" | "COMPANY" | "ADMIN";
export type KycStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
export type KycVerificationStatus = "PENDING" | "PASSED" | "FAILED";
export type KycVerificationType =
  | "NIN"
  | "VNIN"
  | "TIN"
  | "CAC"
  | "BVN"
  | "LIVENESS"
  | "MANUAL";

/** Where one KYC level stands. NOT_STARTED = never attempted. */
export type KycStepStatus = "PASSED" | "FAILED" | "PENDING" | "NOT_STARTED";

export interface KycStep {
  key: string;
  label: string;
  description: string;
  /** Required steps gate VERIFIED; optional ones are informational. */
  required: boolean;
  status: KycStepStatus;
  /** Any one of these check types satisfies the step. */
  accepts: KycVerificationType[];
  satisfiedBy: KycVerificationType | null;
  provider: string | null;
  /** Rows ever written for this step — retries included. */
  attempts: number;
  lastAttemptAt: string | null;
  completedAt: string | null;
  notes: string | null;
}

/** Headline numbers only — what list endpoints return. */
export interface KycProgressSummary {
  status: KycStatus;
  /** 0–100 over required steps. */
  percent: number;
  requiredPassed: number;
  requiredTotal: number;
  /** Labels of required steps not yet passed. */
  blockedBy: string[];
  /** Labels of steps that FAILED — these reject even when optional. */
  failedSteps: string[];
  /** Set when an admin approved or rejected by hand. */
  manualOverride: "PASSED" | "FAILED" | null;
  lastActivityAt: string | null;
}

/** Full per-level breakdown — what detail endpoints return. */
export interface KycProgress extends KycProgressSummary {
  subject: "INVESTOR" | "COMPANY";
  steps: KycStep[];
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  kycStatus: KycStatus;
  createdAt: string;
  wallet: {
    available: string;
    locked: string;
    currency: string;
  } | null;
  kycProgress: KycProgressSummary;
}

export interface UserDetail extends UserListItem {
  anchorCustomerId: string | null;
  updatedAt: string;
  virtualAccount: {
    id: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string | null;
  } | null;
  bankAccounts: BankAccount[];
  verifications: KycVerification[];
  kycProgress: KycProgress;
  company: CompanyDetail | null;
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface KycVerification {
  id: string;
  type: KycVerificationType;
  provider: string;
  status: KycVerificationStatus;
  workflowId: string | null;
  providerRef: string | null;
  notes: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Director {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  isRep: boolean;
  createdAt: string;
}

export interface CompanyListItem {
  id: string;
  name: string;
  rcNumber: string | null;
  tin: string | null;
  kycStatus: KycStatus;
  createdAt: string;
  owner: { id: string; name: string; email: string };
  _count: { directors: number; verifications: number };
  kycProgress: KycProgressSummary;
}

export interface CompanyDetail {
  id: string;
  name: string;
  rcNumber: string | null;
  tin: string | null;
  kycStatus: KycStatus;
  // Underwriting limits — set by admins from the company's audited
  // financials + valuation report. Decimals arrive as strings from the API.
  fundingCap: string | null;
  valuationAmount: string | null;
  fundingCapNotes: string | null;
  fundingCapSetById: string | null;
  fundingCapSetAt: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    kycStatus: KycStatus;
  };
  directors: Director[];
  verifications: KycVerification[];
  kycProgress: KycProgress;
}

export type WithdrawalStatus =
  | "PENDING_OTP"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface WithdrawalListItem {
  id: string;
  status: WithdrawalStatus;
  amount: string;
  fee: string;
  net: string;
  providerRef: string | null;
  failureReason: string | null;
  createdAt: string;
  completedAt: string | null;
  user: { id: string; name: string; email: string; role: Role };
  bankAccount: BankAccount;
}
