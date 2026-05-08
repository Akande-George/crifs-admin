export type AdminRole = "super_admin" | "compliance_officer" | "investment_manager" | "support_agent" | "finance_officer";

export type OnboardingStatus = "incomplete" | "under_review" | "approved" | "rejected";
export type KYCStatus = "not_started" | "pending" | "approved" | "rejected";
export type DocumentStatus = "pending" | "approved" | "rejected" | "expired";
export type FundingStatus = "submitted" | "ai_review" | "human_review" | "approved" | "rejected" | "disbursed";
export type VotingStatus = "active" | "closed" | "quorum_not_reached";
export type BackgroundCheckStatus = "running" | "passed" | "failed" | "manual_review";
export type RiskLevel = "low" | "medium" | "high";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  lastLogin: string;
  isActive: boolean;
}

export interface Company {
  id: string;
  name: string;
  tradingName?: string;
  rcNumber: string;
  tin?: string;
  industry: string;
  onboardingStatus: OnboardingStatus;
  complianceScore: number;
  fundingRequestsCount: number;
  registeredDate: string;
  address: { line1: string; city: string; state: string };
  incorporationDate?: string;
  employees?: number;
  stage?: string;
  description?: string;
  riskLevel?: RiskLevel;
  aiRiskScore?: number;
}

export interface Director {
  id: string;
  name: string;
  role: string;
  nationality: string;
  verificationStatus: KYCStatus;
  backgroundCheckStatus: BackgroundCheckStatus;
  companyId: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  ownerId: string;
  ownerType: "company" | "investor";
  ownerName: string;
  uploadDate: string;
  expiryDate?: string;
  status: DocumentStatus;
  url?: string;
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  kycStatus: KYCStatus;
  accreditationStatus: KYCStatus;
  totalInvested: number;
  portfolioScore: string;
  joinedDate: string;
  nationality: string;
  address: { city: string; state: string };
}

export interface FundingRequest {
  id: string;
  companyId: string;
  companyName: string;
  amount: number;
  linkedMilestone: string;
  submittedDate: string;
  status: FundingStatus;
  aiScore?: number;
  aiFlags?: number;
  useOfFunds: { category: string; amount: number; percentage: number }[];
  adminDecision?: string;
  adminNote?: string;
  disbursedDate?: string;
  disbursedAmount?: number;
}

export interface VotingRound {
  id: string;
  companyId: string;
  companyName: string;
  milestone: string;
  amount: number;
  openDate: string;
  closeDate: string;
  status: VotingStatus;
  totalEligibleVoters: number;
  votesCast: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
}

export interface MarketplaceListing {
  id: string;
  companyId: string;
  companyName: string;
  sector: string;
  stage: string;
  riskLevel: RiskLevel;
  fundingTarget: number;
  amountRaised: number;
  raisedPercent: number;
  minInvestment: number;
  closeDate: string;
  status: "live" | "draft" | "closed" | "featured";
  investorCount: number;
  aiRiskScore: number;
  compliancePercent: number;
}

export interface Report {
  id: string;
  companyId: string;
  companyName: string;
  type: "performance" | "kpi" | "financial";
  period: string;
  submittedDate: string;
  status: "submitted" | "reviewed" | "approved" | "rejected";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  role: AdminRole;
  actionType: string;
  targetEntity: string;
  targetType: string;
  beforeState?: string;
  afterState?: string;
  ipAddress: string;
}

export interface Notification {
  id: string;
  type: string;
  recipient: string;
  recipientType: "company" | "investor";
  message: string;
  sentAt: string;
  status: "delivered" | "failed" | "unread";
}

export interface ActivityFeedItem {
  id: string;
  eventType: string;
  description: string;
  entityId: string;
  entityName: string;
  entityType: "company" | "investor" | "funding" | "vote";
  timestamp: string;
  userId?: string;
}
