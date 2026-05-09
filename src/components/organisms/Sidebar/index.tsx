"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Wallet,
  Store,
  Vote,
  BarChart3,
  Brain,
  FileText,
  DollarSign,
  Bell,
  Settings,
  ScrollText,
  TrendingUp,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

/* ─── Nav Items ─── */

interface NavItemDef {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navSections: { title: string; items: NavItemDef[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Companies", href: "/companies", icon: Building2 },
      { label: "Investors", href: "/investors", icon: Users },
      { label: "KYC Queue", href: "/kyc", icon: ShieldCheck, badge: 3 },
      { label: "Funding", href: "/funding", icon: Wallet },
      { label: "Marketplace", href: "/marketplace", icon: Store },
    ],
  },
  {
    title: "Governance",
    items: [
      { label: "Voting", href: "/voting", icon: Vote },
      { label: "AI Review", href: "/ai-review", icon: Brain },
      { label: "Documents", href: "/documents", icon: FileText },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Finance", href: "/finance", icon: DollarSign },
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "Analytics", href: "/analytics", icon: TrendingUp },
      { label: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Audit Log", href: "/audit", icon: ScrollText },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

/* ─── Sidebar Component ─── */

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  const width = collapsed ? 64 : 240;

  return (
    <motion.aside
      className="flex h-full flex-col border-r border-border bg-surface overflow-hidden shadow-xl lg:shadow-none"
      animate={{ width: "100%" }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.24, ease: [0.25, 1, 0.5, 1] as const }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.svg" 
            alt="CRIFS Admin" 
            width={40}
            height={40}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavClick}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-brand-50 text-brand-500"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        isActive ? "text-brand-500" : "text-neutral-400 group-hover:text-neutral-600"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-danger-500 text-[10px] font-semibold text-white px-1.5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}
