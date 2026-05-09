import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Reports",
  description: "View platform performance metrics and download audit reports.",
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
