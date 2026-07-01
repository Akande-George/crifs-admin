"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Auth session for the admin dashboard.
 *
 * Persisted in localStorage so a refresh doesn't kick the admin out. We do
 * NOT use httpOnly cookies here because the admin is a browser SPA — Next.js
 * server components would need cookies, but every admin page runs client-side
 * (see analysis in the design doc). If we later add server components that
 * need auth, we mirror the token into an HTTP cookie at login and read it
 * server-side there.
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "INVESTOR" | "COMPANY" | "ADMIN";
  kycStatus?: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AdminUser | null;
  hydrated: boolean;
  setSession: (s: {
    accessToken: string;
    refreshToken: string;
    user: AdminUser;
  }) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hydrated: false,
      setSession: (s) =>
        set({
          accessToken: s.accessToken,
          refreshToken: s.refreshToken,
          user: s.user,
        }),
      clear: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
    }),
    {
      name: "crifs-admin-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark hydration complete so guards can distinguish "loading auth" from
        // "definitely logged out".
        if (state) state.hydrated = true;
      },
    },
  ),
);
