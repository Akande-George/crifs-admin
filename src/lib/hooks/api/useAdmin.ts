"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  type CompanyListParams,
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
