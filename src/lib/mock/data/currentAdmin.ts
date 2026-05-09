import type { Admin } from "@/lib/zod/admin";

/* ─── Seeded Admin Users (one per role) ─── */

export const mockAdmins: Admin[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    email: "olusegun.adebayo@crifs.ng",
    firstName: "Olusegun",
    lastName: "Adebayo",
    role: "SUPER_ADMIN",
    avatarUrl: null,
    isActive: true,
    lastLoginAt: "2026-05-08T10:30:00.000Z",
    createdAt: "2024-11-01T09:00:00.000Z",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    email: "amina.mohammed@crifs.ng",
    firstName: "Amina",
    lastName: "Mohammed",
    role: "COMPLIANCE_OFFICER",
    avatarUrl: null,
    isActive: true,
    lastLoginAt: "2026-05-08T09:15:00.000Z",
    createdAt: "2024-12-15T09:00:00.000Z",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    email: "chidi.okonkwo@crifs.ng",
    firstName: "Chidi",
    lastName: "Okonkwo",
    role: "INVESTMENT_MANAGER",
    avatarUrl: null,
    isActive: true,
    lastLoginAt: "2026-05-07T17:45:00.000Z",
    createdAt: "2025-01-10T09:00:00.000Z",
  },
  {
    id: "d4e5f6a7-b8c9-0123-defa-234567890123",
    email: "funke.adeola@crifs.ng",
    firstName: "Funke",
    lastName: "Adeola",
    role: "SUPPORT_AGENT",
    avatarUrl: null,
    isActive: true,
    lastLoginAt: "2026-05-08T08:00:00.000Z",
    createdAt: "2025-02-20T09:00:00.000Z",
  },
  {
    id: "e5f6a7b8-c9d0-1234-efab-345678901234",
    email: "ibrahim.musa@crifs.ng",
    firstName: "Ibrahim",
    lastName: "Musa",
    role: "FINANCE_OFFICER",
    avatarUrl: null,
    isActive: true,
    lastLoginAt: "2026-05-08T11:00:00.000Z",
    createdAt: "2025-03-01T09:00:00.000Z",
  },
];

/** Default admin for the dev role switcher */
export const defaultAdmin = mockAdmins[0]!;
