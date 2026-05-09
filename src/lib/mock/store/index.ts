import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Admin } from "@/lib/zod/admin";
import type { Company } from "@/lib/zod/company";
import type { Investor } from "@/lib/zod/investor";
import type { FundingRequest } from "@/lib/zod/funding";
import type { VotingRound } from "@/lib/zod/voting";
import type { AIReviewReport } from "@/lib/zod/ai";
import type { Document } from "@/lib/zod/document";
import type { Transaction } from "@/lib/zod/finance";
import type { AuditEntry } from "@/lib/zod/audit";
import type { Notification } from "@/lib/zod/notification";
import { mockCompanies } from "../data/companies";
import { mockInvestors } from "../data/investors";
import { mockFundingRequests } from "../data/funding";
import { mockVotingRounds } from "../data/voting";
import { mockAIReports } from "../data/aiReports";
import { mockDocuments } from "../data/documents";
import { mockTransactions } from "../data/finance";
import { mockNotifications } from "../data/notifications";
import { mockAuditLog } from "../data/audit";
import { defaultAdmin } from "../data/currentAdmin";

/* ─── Store Shape ─── */

interface MockStore {
  // Current admin (role switcher)
  currentAdmin: Admin;
  setCurrentAdmin: (admin: Admin) => void;

  // Companies
  companies: Company[];
  updateCompany: (id: string, patch: Partial<Company>) => void;

  // Investors
  investors: Investor[];
  updateInvestor: (id: string, patch: Partial<Investor>) => void;

  // Funding Requests
  fundingRequests: FundingRequest[];
  updateFundingRequest: (id: string, patch: Partial<FundingRequest>) => void;

  // Voting Rounds
  votingRounds: VotingRound[];
  updateVotingRound: (id: string, patch: Partial<VotingRound>) => void;
  addVote: (roundId: string, vote: any) => void;

  // AI Reports
  aiReports: AIReviewReport[];

  // Documents
  documents: Document[];
  updateDocument: (id: string, patch: Partial<Document>) => void;

  // Finance
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;

  // Audit log
  auditLog: AuditEntry[];
  addAuditEntry: (entry: AuditEntry) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Reset
  resetStore: () => void;
}

/* ─── Initial State ─── */

const initialState = {
  currentAdmin: defaultAdmin,
  companies: mockCompanies,
  investors: mockInvestors,
  fundingRequests: mockFundingRequests,
  votingRounds: mockVotingRounds,
  aiReports: mockAIReports,
  documents: mockDocuments,
  transactions: mockTransactions,
  auditLog: mockAuditLog,
  notifications: mockNotifications,
};

/* ─── Store ─── */

export const useMockStore = create<MockStore>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentAdmin: (admin) => set({ currentAdmin: admin }),

      updateCompany: (id, patch) =>
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
          ),
        })),

      updateInvestor: (id, patch) =>
        set((state) => ({
          investors: state.investors.map((inv) =>
            inv.id === id ? { ...inv, ...patch, updatedAt: new Date().toISOString() } : inv
          ),
        })),

      updateFundingRequest: (id, patch) =>
        set((state) => ({
          fundingRequests: state.fundingRequests.map((fr) =>
            fr.id === id ? { ...fr, ...patch, updatedAt: new Date().toISOString() } : fr
          ),
        })),

      updateVotingRound: (id, patch) =>
        set((state) => ({
          votingRounds: state.votingRounds.map((vr) =>
            vr.id === id ? { ...vr, ...patch } : vr
          ),
        })),

      addVote: (roundId, vote) =>
        set((state) => ({
          votingRounds: state.votingRounds.map((vr) =>
            vr.id === roundId ? { ...vr, votes: [...vr.votes, vote] } : vr
          ),
        })),

      updateDocument: (id, patch) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...patch } : doc
          ),
        })),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),

      addAuditEntry: (entry) =>
        set((state) => ({
          auditLog: [entry, ...state.auditLog],
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      resetStore: () => set(initialState),
    }),
    {
      name: "crifs-admin-mock-store",
      version: 6,
    }
  )
);
