import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investors",
  description: "Manage investor profiles and accreditation.",
};

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
