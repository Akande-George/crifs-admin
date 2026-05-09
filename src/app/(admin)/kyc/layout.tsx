import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KYC Queue",
  description: "Monitor and approve pending identity verifications.",
};

export default function KYCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
