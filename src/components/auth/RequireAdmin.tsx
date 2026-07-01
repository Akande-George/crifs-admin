"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/store";

/**
 * Client-side guard for admin routes. Waits for the persisted auth store to
 * hydrate before deciding — otherwise we'd bounce every user to /login on
 * page load while zustand is still reading localStorage.
 *
 * Server-side auth (middleware.ts + cookies) is a future upgrade when we
 * need SEO-safe redirects. For an internal admin tool this client guard is
 * fine.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!hydrated) return;
    if (!token || !user || user.role !== "ADMIN") {
      router.replace("/login");
    }
  }, [hydrated, token, user, router]);

  // Show nothing until we know for sure — prevents "welcome, undefined!"
  // flashes while zustand rehydrates on the client.
  if (!hydrated || !token || !user || user.role !== "ADMIN") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  return <>{children}</>;
}
