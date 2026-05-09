import { z } from "zod";

/* ─── Notification ─── */

export const NotificationTypeSchema = z.enum([
  "COMPANY_SUBMITTED",
  "KYC_COMPLETED",
  "FUNDING_REQUEST",
  "VOTE_REQUIRED",
  "DOCUMENT_UPLOADED",
  "APPROVAL_NEEDED",
  "SYSTEM_ALERT",
  "BROADCAST",
]);

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  actionUrl: z.string().nullable(),
  recipientId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
