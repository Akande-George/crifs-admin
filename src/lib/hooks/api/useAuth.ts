"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/services/auth";
import type { AuthResult } from "@/lib/api/types";
import { useAuthStore } from "@/lib/auth/store";
import { qk } from "./queryKeys";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<AuthResult, Error, { email: string; password: string }>({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (result) => {
      setSession(result);
    },
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clear();
      qc.clear();
    },
  });
}

export function useMe() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: qk.auth.me(),
    queryFn: () => authApi.me(),
    enabled: !!token,
  });
}
