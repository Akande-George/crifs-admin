import type { Notification } from "@/lib/zod/notification";

export const mockNotifications: Notification[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    type: "VOTE_REQUIRED",
    title: "New Voting Round",
    message: "A new voting round has been started for Lagos AgriTech Ltd. Please review the proposal.",
    isRead: false,
    actionUrl: "/voting/vr-aaaa-bbbb-cccc-dddddddddd01",
    recipientId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    createdAt: new Date().toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    type: "COMPANY_SUBMITTED",
    title: "New Company Registered",
    message: "Ondo Cocoa Partners has submitted a new registration request.",
    isRead: false,
    actionUrl: "/companies/c001-aaaa-bbbb-cccc-dddddddddd04",
    recipientId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    type: "SYSTEM_ALERT",
    title: "Server Maintenance",
    message: "System maintenance scheduled for tonight at 2 AM WAT.",
    isRead: true,
    actionUrl: null,
    recipientId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];
