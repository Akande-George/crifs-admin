import { DashboardShell } from "@/components/templates/DashboardShell";
import { RequireAdmin } from "@/components/auth/RequireAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <DashboardShell>{children}</DashboardShell>
    </RequireAdmin>
  );
}
