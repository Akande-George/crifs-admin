import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funding Pipeline",
  description: "Review and manage funding requests and disbursements.",
};

export default function FundingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
