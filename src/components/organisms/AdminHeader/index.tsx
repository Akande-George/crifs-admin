"use client";

import { Bell, Search, RotateCcw, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMockAdmin } from "@/hooks/useMockAdmin";
import { useMockStore } from "@/lib/mock/store";
import type { Role } from "@/lib/zod/admin";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  COMPLIANCE_OFFICER: "Compliance",
  INVESTMENT_MANAGER: "Investment Mgr",
  SUPPORT_AGENT: "Support",
  FINANCE_OFFICER: "Finance",
};

const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: "bg-brand-500 text-white",
  COMPLIANCE_OFFICER: "bg-success-500 text-white",
  INVESTMENT_MANAGER: "bg-warning-500 text-white",
  SUPPORT_AGENT: "bg-neutral-500 text-white",
  FINANCE_OFFICER: "bg-flag-500 text-white",
};

interface AdminHeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export function AdminHeader({ onMenuClick, isMobile }: AdminHeaderProps) {
  const { admin, setAdminByRole } = useMockAdmin();
  const resetStore = useMockStore((s) => s.resetStore);
  const unreadCount = useMockStore((s) =>
    s.notifications.filter((n) => !n.isRead).length
  );
  const toast = useToast();

  const initials = `${admin.firstName[0]}${admin.lastName[0]}`;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile Hamburger */}
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}

        {/* Search - Hide on small mobile */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Dev-only: Role Switcher - Compact on mobile */}
        {process.env.NODE_ENV !== "production" && (
          <div className="hidden md:flex items-center gap-2 border border-dashed border-warning-500 rounded-lg px-2 py-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-warning-600">
              Dev
            </span>
            <Select
              value={admin.role}
              onValueChange={(role) => setAdminByRole(role as Role)}
            >
              <SelectTrigger className="h-7 w-[140px] text-xs border-none bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
                  <SelectItem key={role} value={role} className="text-xs">
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reset mock data */}
        {process.env.NODE_ENV !== "production" && (
          <button
            onClick={() => {
              resetStore();
              toast.success("Mock data reset", "All data restored to initial state");
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
            title="Reset mock data"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 text-[9px] font-bold text-white px-1">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-lg p-1 md:px-2 md:py-1.5 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className={ROLE_COLORS[admin.role]}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-sm font-medium text-neutral-900 leading-tight">
                {admin.firstName}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                {ROLE_LABELS[admin.role]}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{admin.firstName} {admin.lastName}</p>
                <p className="text-xs text-muted-foreground">{admin.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
