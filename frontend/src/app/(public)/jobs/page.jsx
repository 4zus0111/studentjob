import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { JobsBrowser } from "@/components/jobs/jobs-browser";

export const metadata = { title: "Việc làm" };

export default function JobsPage() {
  // useSearchParams needs a Suspense boundary
  return (
    <Suspense fallback={<PageSkeleton />}>
      <JobsBrowser />
    </Suspense>
  );
}
