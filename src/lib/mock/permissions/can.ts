import type { Role } from "@/lib/zod/admin";
import { permissionMatrix, type Action } from "./matrix";

/**
 * Check if a role can perform a given action.
 * This is the ONLY way to check permissions in the app.
 */
export function can(role: Role, action: Action): boolean {
  const permissions = permissionMatrix[role];
  return permissions.has(action);
}

/**
 * Check if a role can perform ANY of the given actions.
 */
export function canAny(role: Role, actions: Action[]): boolean {
  return actions.some((action) => can(role, action));
}

/**
 * Check if a role can perform ALL of the given actions.
 */
export function canAll(role: Role, actions: Action[]): boolean {
  return actions.every((action) => can(role, action));
}
