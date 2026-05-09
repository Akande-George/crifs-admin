import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governance & Voting",
  description: "Review funding proposals and cast your decision.",
};

export default function VotingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
