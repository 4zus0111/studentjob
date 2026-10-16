import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { AreaShell } from "@/components/layout/area-shell";

export default function EmployerLayout({ children }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AreaShell role="EMPLOYER">{children}</AreaShell>
    </Suspense>
  );
}
