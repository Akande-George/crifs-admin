"use client";

import { useMockStore } from "@/lib/mock/store";
import { mockAdmins } from "@/lib/mock/data/currentAdmin";
import type { Admin } from "@/lib/zod/admin";

/**
 * Get and set the current mock admin user.
 * Used by the RoleSwitcher component and all permission checks.
 */
export function useMockAdmin() {
  const currentAdmin = useMockStore((s) => s.currentAdmin);
  const setCurrentAdmin = useMockStore((s) => s.setCurrentAdmin);

  return {
    admin: currentAdmin,
    allAdmins: mockAdmins,
    setAdmin: (admin: Admin) => setCurrentAdmin(admin),
    setAdminByRole: (role: Admin["role"]) => {
      const admin = mockAdmins.find((a) => a.role === role);
      if (admin) setCurrentAdmin(admin);
    },
  };
}
