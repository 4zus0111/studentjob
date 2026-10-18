"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  Briefcase,
  ClipboardList,
  KeyRound,
  LogOut,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-auth";
import { getInitials, ROLE_LABELS } from "@/lib/helpers";

/** Navigation entries per role (shared by the user menu, mobile menu and dashboard tabs). */
export const ROLE_LINKS = {
  STUDENT: [
    { href: "/student/profile", label: "Hồ sơ của tôi", icon: UserRound },
    { href: "/student/applications", label: "Đơn ứng tuyển", icon: ClipboardList },
  ],
  EMPLOYER: [
    { href: "/employer/company", label: "Hồ sơ công ty", icon: Building2 },
    { href: "/employer/jobs", label: "Tin tuyển dụng", icon: Briefcase },
  ],
  ADMIN: [
    { href: "/admin/employers", label: "Duyệt nhà tuyển dụng", icon: ShieldCheck },
    { href: "/admin/jobs", label: "Quản lý tin đăng", icon: Briefcase },
    { href: "/admin/users", label: "Quản lý người dùng", icon: Users },
  ],
};

export function UserMenu({ user }) {
  const router = useRouter();
  const logout = useLogout();
  const links = ROLE_LINKS[user.role] ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-accent"
        aria-label="Menu tài khoản"
      >
        <Avatar>
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {getInitials(user.displayName)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate text-sm font-medium lg:block">{user.displayName}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="space-y-0.5 py-2">
            <p className="truncate text-sm font-semibold text-foreground">{user.displayName}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
            <p className="pt-1 text-xs font-medium text-primary">{ROLE_LABELS[user.role]}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {links.map(({ href, label, icon: Icon }) => (
            <DropdownMenuItem key={href} onClick={() => router.push(href)} className="py-2">
              <Icon />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/account/password")} className="py-2">
          <KeyRound />
          Đổi mật khẩu
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="py-2"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          <LogOut />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
