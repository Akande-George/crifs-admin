"use client";

import { useAuthStore } from "@/lib/auth/store";
import { can, canAny, canAll } from "@/lib/mock/permissions/can";
import type { Action } from "@/lib/mock/permissions/matrix";
import type { Role } from "@/lib/zod/admin";

/**
 * Permission checks for the authenticated session.
 *
 * These are a UX affordance, not a security control. The admin dashboard is a
 * static browser bundle, so anything decided here can be edited by whoever is
 * holding the browser — `api.crifs.io` is the only thing that actually
 * enforces authorization, via RolesGuard on every /admin/* controller.
 *
 * The role comes from the verified session rather than the mock store, which
 * was writable from the client and shipped with a role switcher. Note the
 * backend currently issues one admin role (ADMIN); the finer-grained roles in
 * the matrix below are aspirational until it returns them, so an ADMIN maps to
 * SUPER_ADMIN here. Do NOT introduce a UI that implies a COMPLIANCE_OFFICER
 * cannot do something until the API actually refuses it.
 */
function useSessionRole(): Role | null {
  const user = useAuthStore((s) => s.user);
  return user?.role === "ADMIN" ? "SUPER_ADMIN" : null;
}

export function usePermission(action: Action): boolean {
  const role = useSessionRole();
  return role !== null && can(role, action);
}

export function usePermissionAny(actions: Action[]): boolean {
  const role = useSessionRole();
  return role !== null && canAny(role, actions);
}

export function usePermissionAll(actions: Action[]): boolean {
  const role = useSessionRole();
  return role !== null && canAll(role, actions);
}
