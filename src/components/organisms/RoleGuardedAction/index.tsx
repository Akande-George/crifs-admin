"use client";

import { usePermission } from "@/hooks/usePermission";
import type { Action } from "@/lib/mock/permissions/matrix";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoleGuardedActionProps {
  action: Action;
  children: React.ReactNode;
  /** Shown when user lacks permission */
  fallback?: React.ReactNode;
  /** Tooltip message when disabled */
  disabledMessage?: string;
}

/**
 * Conditionally renders children based on the current admin's permissions.
 * Wraps disabled state in a tooltip explaining why the action is unavailable.
 */
export function RoleGuardedAction({
  action,
  children,
  fallback = null,
  disabledMessage = "You don't have permission to perform this action",
}: RoleGuardedActionProps) {
  const hasPermission = usePermission(action);

  if (hasPermission) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  // Render children as disabled with tooltip
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <div className="opacity-40 pointer-events-none cursor-not-allowed">
            {children}
          </div>
        }
      />
      <TooltipContent>
        <p className="text-xs">{disabledMessage}</p>
      </TooltipContent>
    </Tooltip>
  );
}
