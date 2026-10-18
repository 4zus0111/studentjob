"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ErrorState } from "@/components/common/error-state";
import { JobCard, JobCardSkeleton } from "@/components/jobs/job-card";
import { useJobs } from "@/hooks/use-jobs";
import { cn } from "@/lib/utils";

/** Latest open jobs for the home page. */
export function LatestJobs() {
  const { data, isLoading, isError, error, refetch } = useJobs({ page: 0, size: 6 });

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-16 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Việc làm mới nhất</h2>
          <p className="text-sm text-muted-foreground">Cập nhật liên tục từ các nhà tuyển dụng</p>
        </div>
        <Link href="/jobs" className={cn(buttonVariants({ variant: "ghost" }), "text-primary")}>
          Xem tất cả <ArrowRight />
        </Link>
      </div>

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : data.content.length === 0 ? (
        <p className="rounded-2xl border border-dashed py-10 text-center text-sm text-muted-foreground">
          Chưa có tin tuyển dụng nào. Hãy quay lại sau nhé!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.content.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
