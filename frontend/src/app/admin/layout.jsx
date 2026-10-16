import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { AreaShell } from "@/components/layout/area-shell";

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AreaShell role="ADMIN">{children}</AreaShell>
    </Suspense>
  );
}
