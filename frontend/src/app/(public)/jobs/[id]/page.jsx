import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { JobDetail } from "@/components/jobs/job-detail";

export const metadata = { title: "Chi tiết việc làm" };

async function JobDetailLoader({ params }) {
  const { id } = await params;
  return <JobDetail id={id} />;
}

export default function JobDetailPage({ params }) {
  // Reading route params is request-time data: keep it inside a Suspense boundary
  return (
    <Suspense fallback={<PageSkeleton />}>
      <JobDetailLoader params={params} />
    </Suspense>
  );
}
