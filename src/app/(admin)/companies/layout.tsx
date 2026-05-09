import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies",
  description: "Manage registered companies and their KYC status.",
};

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
