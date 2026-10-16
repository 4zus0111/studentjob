"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { homeFor } from "@/lib/helpers";
import { useAuthStore } from "@/store/auth-store";

function GuardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-10" aria-busy="true">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="grid gap-4 pt-4 sm:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}

/**
 * Client-side route guard for a role area.
 * - session still being restored -> skeleton
 * - not logged in               -> /login?next=<current path>
 * - wrong role                  -> that role's own home
 */
export function RoleGuard({ roles, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const allowed = Boolean(user) && roles.includes(user.role);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (!roles.includes(user.role)) {
      router.replace(homeFor(user.role));
    }
  }, [isInitialized, user, roles, pathname, router]);

  if (!isInitialized || !allowed) return <GuardSkeleton />;
  return children;
}

/** For /login and /register: logged-in users are sent to where they belong. */
export function GuestOnly({ children, redirectTo }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (isInitialized && user) router.replace(redirectTo || homeFor(user.role));
  }, [isInitialized, user, redirectTo, router]);

  if (!isInitialized || user) {
    return (
      <div className="mx-auto w-full max-w-md space-y-4 px-4 py-16" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  return children;
}
