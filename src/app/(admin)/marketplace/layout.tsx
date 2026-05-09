import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Marketplace",
  description: "Discover and manage active investment opportunities.",
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
