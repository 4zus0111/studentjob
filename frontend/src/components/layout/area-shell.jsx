"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RoleGuard } from "@/components/auth/role-guard";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ROLE_LINKS } from "@/components/layout/user-menu";
import { useEmployerProfile } from "@/hooks/use-employer";
import { ROLE_LABELS } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

/** Live approval status from the server (the session copy goes stale once an admin approves). */
function EmployerApprovalBanner() {
  const { data } = useEmployerProfile();
  if (data?.status !== "PENDING_APPROVAL") return null;
  return (
    <Alert className="border-amber-300 bg-amber-50 text-amber-900">
      <Clock />
      <AlertTitle>Tài khoản đang chờ duyệt</AlertTitle>
      <AlertDescription className="text-amber-800">
        Bạn có thể cập nhật hồ sơ công ty, nhưng chỉ đăng tin tuyển dụng được sau khi quản trị viên phê duyệt.
      </AlertDescription>
    </Alert>
  );
}

/**
 * Layout used by /student, /employer and /admin: navbar, role guard, section tabs and footer.
 * `role` is the only role allowed inside this area.
 */
export function AreaShell({ role, children }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const links = ROLE_LINKS[role] ?? [];

  return (
    <>
      <Navbar />
      <RoleGuard roles={[role]}>
        <div className="border-b bg-linear-to-b from-accent/60 to-background">
          <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">{ROLE_LABELS[role]}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Xin chào, {user?.displayName}</h1>

            <nav className="-mb-px mt-5 flex gap-1 overflow-x-auto" aria-label="Điều hướng khu vực">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
          {role === "EMPLOYER" && <EmployerApprovalBanner />}
          {children}
        </main>
      </RoleGuard>
      <Footer />
    </>
  );
}
