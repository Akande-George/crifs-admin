import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Stay updated with system activities and alerts.",
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
