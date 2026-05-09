"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { 
  Bell, Check, ExternalLink, 
  Clock, ShieldCheck, Wallet, Vote, 
  Building2, FileText, AlertCircle, Megaphone
} from "lucide-react";
import { useMockStore } from "@/lib/mock/store";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/lib/zod/notification";

const TYPE_CONFIG: Record<NotificationType, { icon: any, color: string }> = {
  COMPANY_SUBMITTED: { icon: Building2, color: "text-brand-500 bg-brand-50" },
  KYC_COMPLETED: { icon: ShieldCheck, color: "text-success-500 bg-success-50" },
  FUNDING_REQUEST: { icon: Wallet, color: "text-brand-accent bg-brand-accent/10" },
  VOTE_REQUIRED: { icon: Vote, color: "text-warning-500 bg-warning-50" },
  DOCUMENT_UPLOADED: { icon: FileText, color: "text-neutral-500 bg-neutral-100" },
  APPROVAL_NEEDED: { icon: Check, color: "text-brand-500 bg-brand-50" },
  SYSTEM_ALERT: { icon: AlertCircle, color: "text-danger-500 bg-danger-50" },
  BROADCAST: { icon: Megaphone, color: "text-neutral-700 bg-neutral-100" },
};

export default function NotificationsPage() {
  const notifications = useMockStore((s) => s.notifications);
  const markRead = useMockStore((s) => s.markNotificationRead);
  const markAllRead = useMockStore((s) => s.markAllNotificationsRead);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">Notification Center</h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">Stay updated with system activities</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="h-9 px-4 rounded-lg border border-neutral-200 text-[10px] md:text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 self-start sm:self-center"
          >
            <Check className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((n, i) => {
            const config = TYPE_CONFIG[n.type];
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "group relative rounded-2xl border p-4 md:p-5 flex gap-3 md:gap-4 transition-all",
                  n.isRead 
                    ? "bg-surface border-neutral-100 opacity-80" 
                    : "bg-surface border-brand-500/20 shadow-lg shadow-brand-500/5"
                )}
              >
                {!n.isRead && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-brand-500 rounded-r-full" />
                )}
                
                <div className={cn("flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl shrink-0", config.color)}>
                  <config.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                    <h3 className={cn("text-xs md:text-sm font-bold truncate", n.isRead ? "text-neutral-700" : "text-neutral-900")}>
                      {n.title}
                    </h3>
                    <span className="text-[9px] md:text-[10px] font-medium text-neutral-400 flex items-center gap-1 uppercase tracking-wider shrink-0">
                      <Clock className="h-3 w-3" /> {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-neutral-500 leading-relaxed max-w-2xl">
                    {n.message}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-2 md:pt-3">
                    {n.actionUrl && (
                      <Link 
                        href={n.actionUrl}
                        className="text-[10px] md:text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
                        onClick={() => markRead(n.id)}
                      >
                        Action <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                    {!n.isRead && (
                      <button 
                        onClick={() => markRead(n.id)}
                        className="text-[10px] md:text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="py-20 text-center">
            <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-neutral-200" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">All caught up!</h2>
            <p className="text-xs text-neutral-500 mt-1">You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}
