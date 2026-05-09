"use client";

import { useMockAdmin } from "./useMockAdmin";
import { can, canAny, canAll } from "@/lib/mock/permissions/can";
import type { Action } from "@/lib/mock/permissions/matrix";

/**
 * Check if the current mock admin can perform an action.
 */
export function usePermission(action: Action): boolean {
  const { admin } = useMockAdmin();
  return can(admin.role, action);
}

/**
 * Check if the current mock admin can perform ANY of the given actions.
 */
export function usePermissionAny(actions: Action[]): boolean {
  const { admin } = useMockAdmin();
  return canAny(admin.role, actions);
}

/**
 * Check if the current mock admin can perform ALL of the given actions.
 */
export function usePermissionAll(actions: Action[]): boolean {
  const { admin } = useMockAdmin();
  return canAll(admin.role, actions);
}
