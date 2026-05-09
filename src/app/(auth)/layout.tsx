import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | CRIFS Admin",
  description: "Secure login for CRIFS administrative personnel.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
