"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * AuthGuard — Client-side authentication guard.
 * Validates the user session via Appwrite SDK (account.get()).
 * Redirects unauthenticated users to /login with original path preserved.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading) {
    return (
      <div
        className="h-screen w-screen flex flex-col items-center justify-center text-corp-accent"
        style={{ background: "var(--corp-bg)" }}
      >
        <Loader2 size={40} className="animate-spin mb-4" />
        <p
          className="text-[14px] font-medium"
          style={{ color: "var(--corp-text-secondary)" }}
        >
          Verifying session...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="h-screen w-screen flex flex-col items-center justify-center text-corp-accent"
        style={{ background: "var(--corp-bg)" }}
      >
        <Loader2 size={40} className="animate-spin mb-4" />
        <p
          className="text-[14px] font-medium"
          style={{ color: "var(--corp-text-secondary)" }}
        >
          Redirecting to sign in...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
