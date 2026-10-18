import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { AccountShell } from "@/components/layout/account-shell";

export default function AccountLayout({ children }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AccountShell>{children}</AccountShell>
    </Suspense>
  );
}
