import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Analysis",
  description: "Automated risk assessment and document verification reports.",
};

export default function AIReviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
