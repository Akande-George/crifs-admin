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
};
