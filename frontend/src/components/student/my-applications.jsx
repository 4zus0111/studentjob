"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, CalendarDays, ClipboardList } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Pager } from "@/components/common/pager";
import { StatusBadge } from "@/components/common/status-badge";
import { useMyApplications } from "@/hooks/use-student";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const NOTES = {
  PENDING: "Nhà tuyển dụng chưa xem xét hồ sơ này.",
  ACCEPTED: "Chúc mừng! Nhà tuyển dụng đã chấp nhận hồ sơ của bạn.",
  REJECTED: "Rất tiếc, hồ sơ lần này chưa phù hợp.",
};

export function MyApplications() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error, refetch } = useMyApplications({ page, size: 10 });

  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (data.content.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Bạn chưa ứng tuyển vị trí nào"
        description="Hãy tìm việc làm phù hợp và gửi hồ sơ đầu tiên của bạn."
        action={
          <Link href="/jobs" className={cn(buttonVariants(), "h-10")}>
            Tìm việc làm
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {data.content.map((a) => (
        <article key={a.id} className="space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <Link href={`/jobs/${a.jobId}`} className="line-clamp-2 font-semibold hover:text-primary hover:underline">
                {a.jobTitle}
              </Link>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-4" /> {a.companyName}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" /> Ứng tuyển {formatDateTime(a.createdAt)}
                </span>
              </div>
            </div>
            <StatusBadge kind="application" value={a.status} />
          </div>
          <p className="text-sm text-muted-foreground">{NOTES[a.status]}</p>
          {a.coverLetter && (
            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-primary">Thư giới thiệu của bạn</summary>
              <p className="mt-2 rounded-lg bg-muted p-3 whitespace-pre-line">{a.coverLetter}</p>
            </details>
          )}
        </article>
      ))}
      <Pager page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onChange={setPage} />
    </div>
  );
}
