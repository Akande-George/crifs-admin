import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage global platform parameters and security thresholds.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
