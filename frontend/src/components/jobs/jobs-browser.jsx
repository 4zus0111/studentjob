"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Pager } from "@/components/common/pager";
import { JobCard, JobCardSkeleton } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { useJobs } from "@/hooks/use-jobs";

const PAGE_SIZE = 9;
const FILTER_KEYS = ["keyword", "categoryId", "jobType", "location", "salaryMin"];

/** /jobs: the URL query string is the single source of truth for filters and page. */
export function JobsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, searchParams.get(k) ?? ""]));
  const page = Math.max(0, (Number(searchParams.get("page")) || 1) - 1);

  const { data, isLoading, isError, error, refetch, isFetching } = useJobs({ ...filters, page, size: PAGE_SIZE });

  function navigate(nextFilters, nextPage = 0) {
    const qs = new URLSearchParams();
    FILTER_KEYS.forEach((k) => nextFilters[k] && qs.set(k, nextFilters[k]));
    if (nextPage > 0) qs.set("page", String(nextPage + 1));
    const query = qs.toString();
    router.push(query ? `/jobs?${query}` : "/jobs");
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Tìm việc làm</h1>
        <p className="text-sm text-muted-foreground">
          {data ? `${data.totalElements} việc làm đang tuyển` : "Khám phá cơ hội thực tập và việc làm dành cho sinh viên"}
        </p>
      </div>

      {/* Remount on URL change so the draft always matches the URL (back/forward, "clear") */}
      <JobFilters key={searchParams.toString()} values={filters} onApply={(next) => navigate(next)} />

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : data.content.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Không tìm thấy việc làm phù hợp"
          description="Hãy thử đổi từ khóa hoặc bỏ bớt bộ lọc."
          action={
            <Button variant="outline" onClick={() => navigate({})}>
              Xóa bộ lọc
            </Button>
          }
        />
      ) : (
        <>
          <div
            className={`grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}
          >
            {data.content.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <Pager
            page={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            onChange={(p) => {
              navigate(filters, p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}
