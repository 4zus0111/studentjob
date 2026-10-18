"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ROLES } from "@/lib/helpers";

const ALL_ROLES = Object.values(ROLES);

/** Layout for pages every logged-in user can open (any role), e.g. /account/password. */
export function AccountShell({ children }) {
  return (
    <>
      <Navbar />
      <RoleGuard roles={ALL_ROLES}>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">{children}</main>
      </RoleGuard>
      <Footer />
    </>
  );
}
