import { Suspense } from "react";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { ApplicantsList } from "@/components/employer/applicants-list";

export const metadata = { title: "Ứng viên" };

async function ApplicantsLoader({ params }) {
  const { id } = await params;
  return <ApplicantsList jobId={id} />;
}

export default function ApplicantsPage({ params }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ApplicantsLoader params={params} />
    </Suspense>
  );
}
