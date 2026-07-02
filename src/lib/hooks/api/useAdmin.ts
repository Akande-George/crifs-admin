"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  type CompanyListParams,
  type FundingRequestListParams,
  type ListingListParams,
  type UserListParams,
  type WithdrawalListParams,
} from "@/lib/api/services/admin";
import { useAuthStore } from "@/lib/auth/store";
import { qk } from "./queryKeys";

export function useAdminUsers(params: UserListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.users.list(params),
    queryFn: () => adminApi.listUsers(params),
    enabled: !!token,
  });
}

export function useAdminUser(id: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.users.detail(id),
    queryFn: () => adminApi.getUser(id),
    enabled: !!token && !!id,
  });
}

export function useAdminCompanies(params: CompanyListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.companies.list(params),
    queryFn: () => adminApi.listCompanies(params),
    enabled: !!token,
  });
}

export function useAdminCompany(id: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.companies.detail(id),
    queryFn: () => adminApi.getCompany(id),
    enabled: !!token && !!id,
  });
}

export function useAdminWithdrawals(params: WithdrawalListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.withdrawals.list(params),
    queryFn: () => adminApi.listWithdrawals(params),
    enabled: !!token,
  });
}

export function useAdminWithdrawal(id: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.withdrawals.detail(id),
    queryFn: () => adminApi.getWithdrawal(id),
    enabled: !!token && !!id,
  });
}

// ── KYC review mutations — invalidate the related lists so tables refresh ──

export function useApproveUserKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes: string }) =>
      adminApi.approveUserKyc(userId, notes),
    onSuccess: (_r, { userId }) => {
      void qc.invalidateQueries({ queryKey: qk.admin.users.detail(userId) });
      void qc.invalidateQueries({ queryKey: ["admin", "users", "list"] });
    },
  });
}

export function useRejectUserKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes: string }) =>
      adminApi.rejectUserKyc(userId, notes),
    onSuccess: (_r, { userId }) => {
      void qc.invalidateQueries({ queryKey: qk.admin.users.detail(userId) });
      void qc.invalidateQueries({ queryKey: ["admin", "users", "list"] });
    },
  });
}

export function useApproveCompanyKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, notes }: { companyId: string; notes: string }) =>
      adminApi.approveCompanyKyc(companyId, notes),
    onSuccess: (_r, { companyId }) => {
      void qc.invalidateQueries({
        queryKey: qk.admin.companies.detail(companyId),
      });
      void qc.invalidateQueries({ queryKey: qk.admin.companies.all });
    },
  });
}

export function useRejectCompanyKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, notes }: { companyId: string; notes: string }) =>
      adminApi.rejectCompanyKyc(companyId, notes),
    onSuccess: (_r, { companyId }) => {
      void qc.invalidateQueries({
        queryKey: qk.admin.companies.detail(companyId),
      });
      void qc.invalidateQueries({ queryKey: qk.admin.companies.all });
    },
  });
}

// ── Funding requests ───────────────────────────────────────────────────

export function useAdminFundingRequests(params: FundingRequestListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.fundingRequests.list(params),
    queryFn: () => adminApi.listFundingRequests(params),
    enabled: !!token,
    // Poll while any AI analysis is in flight so the review queue updates
    // without a manual refresh.
    refetchInterval: (query) => {
      const rows = query.state.data?.data ?? [];
      const anyRunning = rows.some(
        (r) => r.aiStatus === "PENDING" || r.aiStatus === "RUNNING",
      );
      return anyRunning ? 10_000 : false;
    },
  });
}

export function useApproveFundingRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      adminApi.approveFundingRequest(id, notes),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.admin.fundingRequests.all });
      void qc.invalidateQueries({ queryKey: qk.admin.listings.all });
    },
  });
}

export function useRejectFundingRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      adminApi.rejectFundingRequest(id, notes),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.admin.fundingRequests.all });
    },
  });
}

export function useRerunFundingAi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.rerunFundingAi(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.admin.fundingRequests.all });
    },
  });
}

// ── Listings ───────────────────────────────────────────────────────────

export function useAdminListings(params: ListingListParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.listings.list(params),
    queryFn: () => adminApi.listListings(params),
    enabled: !!token,
  });
}

export function useAdminListing(id: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.listings.detail(id),
    queryFn: () => adminApi.getListing(id),
    enabled: !!token && !!id,
  });
}

export function useAdminListingInvestments(id: string) {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.admin.listings.investments(id),
    queryFn: () => adminApi.listListingInvestments(id, { perPage: 100 }),
    enabled: !!token && !!id,
  });
}

function useListingMutation(
  fn: (id: string) => Promise<unknown>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fn(id),
    onSuccess: (_r, id) => {
      void qc.invalidateQueries({ queryKey: qk.admin.listings.all });
      void qc.invalidateQueries({ queryKey: qk.admin.listings.detail(id) });
    },
  });
}

export const usePublishListing = () =>
  useListingMutation(adminApi.publishListing);
export const useCloseListing = () => useListingMutation(adminApi.closeListing);
export const useCancelListing = () => useListingMutation(adminApi.cancelListing);
