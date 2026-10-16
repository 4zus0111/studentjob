"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/layout/logo";
import { ROLE_LINKS, UserMenu } from "@/components/layout/user-menu";
import { useLogout } from "@/hooks/use-auth";
import { getInitials, ROLE_LABELS } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/jobs", label: "Việc làm" },
];

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  const roleLinks = user ? (ROLE_LINKS[user.role] ?? []) : [];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo />

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(pathname, href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Desktop auth area */}
          <div className="hidden items-center gap-2 md:flex">
            {!isInitialized ? (
              <Skeleton className="h-9 w-32 rounded-full" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "h-9 px-4")}>
                  Đăng nhập
                </Link>
                <Link href="/register" className={cn(buttonVariants(), "h-9 px-4 shadow-sm")}>
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "md:hidden")}
              aria-label="Mở menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0 p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {user && (
                  <div className="mb-2 flex items-center gap-3 rounded-xl bg-accent/60 p-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {getInitials(user.displayName)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.displayName}</p>
                      <p className="truncate text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
                    </div>
                  </div>
                )}

                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      isActive(pathname, href) ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                    )}
                  >
                    {label}
                  </Link>
                ))}

                {roleLinks.length > 0 && (
                  <>
                    <p className="mt-3 px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Tài khoản
                    </p>
                    {roleLinks.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium",
                          isActive(pathname, href) ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                        )}
                      >
                        <Icon className="size-4" />
                        {label}
                      </Link>
                    ))}
                  </>
                )}
              </div>

              <div className="border-t p-3">
                {!isInitialized ? (
                  <Skeleton className="h-10 w-full" />
                ) : user ? (
                  <Button
                    variant="outline"
                    className="h-10 w-full text-destructive"
                    disabled={logout.isPending}
                    onClick={() => {
                      setOpen(false);
                      logout.mutate();
                    }}
                  >
                    <LogOut /> Đăng xuất
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants({ variant: "outline" }), "h-10")}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className={cn(buttonVariants(), "h-10")}
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
