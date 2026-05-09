import { z } from "zod";

/* ─── Voting ─── */

export const VoteValueSchema = z.enum(["APPROVE", "REJECT", "ABSTAIN"]);

export const VoteSchema = z.object({
  id: z.string().uuid(),
  roundId: z.string().uuid(),
  voterId: z.string().uuid(),
  voterName: z.string(),
  voterRole: z.string(),
  value: VoteValueSchema,
  comment: z.string().nullable(),
  votedAt: z.string().datetime(),
});

export const VotingRoundStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const VotingRoundSchema = z.object({
  id: z.string().uuid(),
  fundingRequestId: z.string().uuid(),
  companyName: z.string(),
  requestTitle: z.string(),
  amountRequested: z.number().positive(),
  status: VotingRoundStatusSchema,
  requiredVotes: z.number().int().positive(),
  votes: z.array(VoteSchema),
  approvalThreshold: z.number().min(0).max(100), // percentage
  result: z.enum(["APPROVED", "REJECTED", "PENDING"]),
  startedAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export type VoteValue = z.infer<typeof VoteValueSchema>;
export type Vote = z.infer<typeof VoteSchema>;
export type VotingRoundStatus = z.infer<typeof VotingRoundStatusSchema>;
export type VotingRound = z.infer<typeof VotingRoundSchema>;
