import { apiClient } from "../client";
import type {
  ApiResponse,
  CompanyDetail,
  CompanyListItem,
  KycStatus,
  PaginatedResponse,
  Role,
  UserDetail,
  UserListItem,
  WithdrawalListItem,
  WithdrawalStatus,
} from "../types";

export interface UserListParams {
  page?: number;
  perPage?: number;
  role?: Role;
  kycStatus?: KycStatus;
  q?: string;
}

export interface CompanyListParams {
  page?: number;
  perPage?: number;
  kycStatus?: KycStatus;
  q?: string;
}

export interface WithdrawalListParams {
  page?: number;
  perPage?: number;
  status?: WithdrawalStatus;
  userId?: string;
}

export const adminApi = {
  // ── Users ─────────────────────────────────────────────────────────────
  async listUsers(params: UserListParams = {}) {
    const { data } = await apiClient.get<PaginatedResponse<UserListItem>>(
      "/admin/users",
      { params },
    );
    return data;
  },
  async getUser(id: string): Promise<UserDetail> {
    const { data } = await apiClient.get<ApiResponse<UserDetail>>(
      `/admin/users/${id}`,
    );
    return data.data;
  },

  // ── Companies ────────────────────────────────────────────────────────
  async listCompanies(params: CompanyListParams = {}) {
    const { data } = await apiClient.get<PaginatedResponse<CompanyListItem>>(
      "/admin/companies",
      { params },
    );
    return data;
  },
  async getCompany(id: string): Promise<CompanyDetail> {
    const { data } = await apiClient.get<ApiResponse<CompanyDetail>>(
      `/admin/companies/${id}`,
    );
    return data.data;
  },

  // ── Withdrawals ──────────────────────────────────────────────────────
  async listWithdrawals(params: WithdrawalListParams = {}) {
    const { data } = await apiClient.get<PaginatedResponse<WithdrawalListItem>>(
      "/admin/withdrawals",
      { params },
    );
    return data;
  },
  async getWithdrawal(id: string) {
    const { data } = await apiClient.get<ApiResponse<WithdrawalListItem>>(
      `/admin/withdrawals/${id}`,
    );
    return data.data;
  },

  // ── KYC review mutations (uses existing /admin/kyc/* endpoints) ──────
  async approveUserKyc(userId: string, notes: string) {
    const { data } = await apiClient.post<ApiResponse<{ id: string; kycStatus: KycStatus }>>(
      `/admin/kyc/users/${userId}/approve`,
      { notes },
    );
    return data.data;
  },
  async rejectUserKyc(userId: string, notes: string) {
    const { data } = await apiClient.post<ApiResponse<{ id: string; kycStatus: KycStatus }>>(
      `/admin/kyc/users/${userId}/reject`,
      { notes },
    );
    return data.data;
  },
  async approveCompanyKyc(companyId: string, notes: string) {
    const { data } = await apiClient.post<ApiResponse<{ id: string; kycStatus: KycStatus }>>(
      `/admin/kyc/companies/${companyId}/approve`,
      { notes },
    );
    return data.data;
  },
  async rejectCompanyKyc(companyId: string, notes: string) {
    const { data } = await apiClient.post<ApiResponse<{ id: string; kycStatus: KycStatus }>>(
      `/admin/kyc/companies/${companyId}/reject`,
      { notes },
    );
    return data.data;
  },

  // ── Funding requests ──────────────────────────────────────────────────
  async listFundingRequests(params: FundingRequestListParams = {}) {
    const { data } = await apiClient.get<
      PaginatedResponse<AdminFundingRequest>
    >("/admin/funding-requests", { params });
    return data;
  },
  async approveFundingRequest(id: string, reviewNotes?: string) {
    const { data } = await apiClient.post<
      ApiResponse<{ request: AdminFundingRequest; listing: AdminListing }>
    >(`/admin/funding-requests/${id}/approve`, { reviewNotes });
    return data.data;
  },
  async rejectFundingRequest(id: string, reviewNotes?: string) {
    const { data } = await apiClient.post<ApiResponse<AdminFundingRequest>>(
      `/admin/funding-requests/${id}/reject`,
      { reviewNotes },
    );
    return data.data;
  },
  async rerunFundingAi(id: string) {
    const { data } = await apiClient.post<
      ApiResponse<{ queued: boolean; id: string }>
    >(`/admin/funding-requests/${id}/rerun-ai`, {});
    return data.data;
  },

  // ── Listings ──────────────────────────────────────────────────────────
  async listListings(params: ListingListParams = {}) {
    const { data } = await apiClient.get<PaginatedResponse<AdminListing>>(
      "/admin/listings",
      { params },
    );
    return data;
  },
  async getListing(id: string): Promise<AdminListing> {
    const { data } = await apiClient.get<ApiResponse<AdminListing>>(
      `/admin/listings/${id}`,
    );
    return data.data;
  },
  async listListingInvestments(id: string, params: { page?: number; perPage?: number } = {}) {
    const { data } = await apiClient.get<
      PaginatedResponse<AdminInvestment>
    >(`/admin/listings/${id}/investments`, { params });
    return data;
  },
  async publishListing(id: string) {
    const { data } = await apiClient.post<ApiResponse<AdminListing>>(
      `/admin/listings/${id}/publish`,
      {},
    );
    return data.data;
  },
  async closeListing(id: string) {
    const { data } = await apiClient.post<ApiResponse<AdminListing>>(
      `/admin/listings/${id}/close`,
      {},
    );
    return data.data;
  },
  async cancelListing(id: string) {
    const { data } = await apiClient.delete<ApiResponse<AdminListing>>(
      `/admin/listings/${id}`,
    );
    return data.data;
  },
};

// ── Funding-request + listing types ──────────────────────────────────────

export type FundingRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AiAnalysisStatus = "PENDING" | "RUNNING" | "COMPLETE" | "FAILED";

export interface FundingRequestListParams {
  page?: number;
  perPage?: number;
  status?: FundingRequestStatus;
}

export interface AdminFundingRequest {
  id: string;
  title: string;
  description: string;
  targetAmount: string;
  minInvestment: string;
  unitPrice: string;
  status: FundingRequestStatus;
  reviewNotes: string | null;
  reviewedAt: string | null;
  linkedListingId: string | null;
  aiStatus: AiAnalysisStatus;
  aiReportId: string | null;
  aiAnalysis: string | null;
  aiError: string | null;
  createdAt: string;
  company: { id: string; name: string; kycStatus: KycStatus };
}

export type ListingStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "CANCELLED";

export interface ListingListParams {
  page?: number;
  perPage?: number;
  status?: ListingStatus;
  companyId?: string;
  q?: string;
}

export interface AdminListing {
  id: string;
  title: string;
  description: string;
  status: ListingStatus;
  targetAmount: string;
  minInvestment: string;
  unitPrice: string;
  raisedAmount: string;
  coverImageKey: string | null;
  openAt: string | null;
  closeAt: string | null;
  publishedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  company: { id: string; name: string; kycStatus: KycStatus };
  _count?: { investments: number };
}

export type InvestmentStatus =
  | "COMMITTED"
  | "SETTLED"
  | "REFUNDED"
  | "CANCELLED";

export interface AdminInvestment {
  id: string;
  status: InvestmentStatus;
  amount: string;
  unitsAllotted: string;
  committedAt: string;
  user: { id: string; name: string; email: string; kycStatus: KycStatus };
}
