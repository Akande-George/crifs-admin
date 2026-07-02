import type {
  CompanyListParams,
  FundingRequestListParams,
  ListingListParams,
  UserListParams,
  WithdrawalListParams,
} from "@/lib/api/services/admin";

export const qk = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  admin: {
    users: {
      list: (p?: UserListParams) => ["admin", "users", "list", p ?? {}] as const,
      detail: (id: string) => ["admin", "users", "detail", id] as const,
    },
    companies: {
      all: ["admin", "companies"] as const,
      list: (p?: CompanyListParams) =>
        ["admin", "companies", "list", p ?? {}] as const,
      detail: (id: string) => ["admin", "companies", "detail", id] as const,
    },
    withdrawals: {
      list: (p?: WithdrawalListParams) =>
        ["admin", "withdrawals", "list", p ?? {}] as const,
      detail: (id: string) =>
        ["admin", "withdrawals", "detail", id] as const,
    },
    fundingRequests: {
      all: ["admin", "funding-requests"] as const,
      list: (p?: FundingRequestListParams) =>
        ["admin", "funding-requests", "list", p ?? {}] as const,
    },
    listings: {
      all: ["admin", "listings"] as const,
      list: (p?: ListingListParams) =>
        ["admin", "listings", "list", p ?? {}] as const,
      detail: (id: string) => ["admin", "listings", "detail", id] as const,
      investments: (id: string) =>
        ["admin", "listings", "investments", id] as const,
    },
  },
};
