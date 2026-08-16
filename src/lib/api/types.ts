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
