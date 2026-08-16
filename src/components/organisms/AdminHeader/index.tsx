"use client";

import { Bell, Search, RotateCcw, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMockStore } from "@/lib/mock/store";
import { useAuthStore } from "@/lib/auth/store";
import { useLogout } from "@/lib/hooks/api/useAuth";
import { useToast } from "@/hooks/useToast";

/** Friendly label for the real auth role stored in the session. */
function roleLabel(role?: string): string {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "COMPANY":
      return "Company";
    case "INVESTOR":
      return "Investor";
    default:
      return "Admin";
  }
}

/** Two-letter initials from a full name ("Ada Obi" -> "AO", "Ada" -> "AD"). */
function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const p0 = parts[0] ?? "";
  if (!p0) return "AD";
  const first = p0[0] ?? "";
  const second = parts[1]?.[0] ?? p0[1] ?? "";
  return (first + second).toUpperCase();
}

interface AdminHeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export function AdminHeader({ onMenuClick, isMobile }: AdminHeaderProps) {
  const router = useRouter();
  // Real logged-in admin (from the auth session), not mock seed data.
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  // Mock store still powers the dev-only role switcher + reset button below.
  const resetStore = useMockStore((s) => s.resetStore);
  const unreadCount = useMockStore((s) =>
    s.notifications.filter((n) => !n.isRead).length
  );
  const toast = useToast();

  const displayName = user?.name?.trim() || "Admin";
  const displayEmail = user?.email ?? "";
  const displayRole = roleLabel(user?.role);
  const initials = initialsFor(displayName);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/login"),
    });
  };

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
              <AvatarFallback className="bg-brand-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-sm font-medium text-neutral-900 leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                {displayRole}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{displayName}</p>
                {displayEmail && (
                  <p className="text-xs text-muted-foreground">{displayEmail}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              {logout.isPending ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
