"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  FileSearch,
  Layers,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ApplyDialog } from "@/components/jobs/apply-dialog";
import { CompanyLogo } from "@/components/jobs/company-logo";
import { StatusBadge } from "@/components/common/status-badge";
import { useJob } from "@/hooks/use-jobs";
import { useMyApplicationForJob } from "@/hooks/use-student";
import { deadlineLabel, formatDate, formatSalary, isExpired, JOB_TYPE_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

function InfoRow({ icon: Icon, label, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{children}</p>
      </div>
    </li>
  );
}

function ApplyPanel({ job }) {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const [open, setOpen] = useState(false);
  const isStudent = user?.role === "STUDENT";
  const { data: myApplication, isLoading: checkingApplication } = useMyApplicationForJob(job.id, isStudent);

  const closed = job.status !== "OPEN" || isExpired(job.deadline);

  // A student who already applied sees the status, even if the job has since closed
  if (isStudent && myApplication) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="size-4" /> Bạn đã ứng tuyển
          </span>
          <StatusBadge kind="application" value={myApplication.status} />
        </div>
        <Link href="/student/applications" className={cn(buttonVariants({ variant: "outline" }), "h-10 w-full")}>
          Xem đơn ứng tuyển
        </Link>
      </div>
    );
  }

  if (closed) {
    return (
      <Button disabled className="h-11 w-full">
        {isExpired(job.deadline) ? "Đã hết hạn nộp hồ sơ" : "Tin tuyển dụng đã đóng"}
      </Button>
    );
  }
  if (!isInitialized) return <Skeleton className="h-11 w-full" />;

  if (!user) {
    return (
      <div className="space-y-2">
        <Link href={`/login?next=${encodeURIComponent(`/jobs/${job.id}`)}`} className={cn(buttonVariants(), "h-11 w-full")}>
          Đăng nhập để ứng tuyển
        </Link>
        <p className="text-center text-xs text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Đăng ký sinh viên
          </Link>
        </p>
      </div>
    );
  }
  if (user.role !== "STUDENT") {
    return (
      <p className="rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground">
        Chỉ tài khoản sinh viên mới có thể ứng tuyển.
      </p>
    );
  }
  if (checkingApplication) return <Skeleton className="h-11 w-full" />;
  return (
    <>
      <Button className="h-11 w-full text-sm shadow-sm" onClick={() => setOpen(true)}>
        Ứng tuyển ngay
      </Button>
      <ApplyDialog job={job} open={open} onOpenChange={setOpen} />
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6" aria-busy="true">
      <Skeleton className="h-5 w-32" />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function JobDetail({ id }) {
  const { data: job, isLoading, isError, error, refetch } = useJob(id);

  if (isLoading) return <DetailSkeleton />;

  if (isError) {
    const notFound = error?.response?.status === 404;
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        {notFound ? (
          <EmptyState
            icon={FileSearch}
            title="Không tìm thấy tin tuyển dụng"
            description="Tin này không tồn tại hoặc đã bị gỡ."
            action={
              <Link href="/jobs" className={buttonVariants({ variant: "outline" })}>
                Xem việc làm khác
              </Link>
            }
          />
        ) : (
          <ErrorState error={error} onRetry={refetch} />
        )}
      </div>
    );
  }

  const expired = isExpired(job.deadline);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Quay lại danh sách
      </Link>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <CompanyLogo name={job.companyName} url={job.companyLogoUrl} className="size-16 text-2xl" />
              <div className="min-w-0 space-y-1">
                <h1 className="text-2xl leading-tight font-bold tracking-tight">{job.title}</h1>
                <p className="text-muted-foreground">{job.companyName}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-accent text-accent-foreground">{JOB_TYPE_LABELS[job.jobType]}</Badge>
              <Badge variant="outline">{job.category?.name}</Badge>
              {job.status === "CLOSED" && <Badge variant="outline">Đã đóng</Badge>}
              {expired && <Badge variant="destructive">Hết hạn</Badge>}
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Mô tả công việc</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </section>

          {job.requirements && (
            <section className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Yêu cầu ứng viên</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </section>
          )}
        </div>

        <aside className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <ApplyPanel job={job} />
          <ul className="space-y-4 border-t pt-4">
            <InfoRow icon={Banknote} label="Mức lương">{formatSalary(job.salaryMin, job.salaryMax)}</InfoRow>
            <InfoRow icon={Briefcase} label="Loại hình">{JOB_TYPE_LABELS[job.jobType]}</InfoRow>
            <InfoRow icon={Layers} label="Danh mục">{job.category?.name}</InfoRow>
            {job.location && <InfoRow icon={MapPin} label="Địa điểm">{job.location}</InfoRow>}
            <InfoRow icon={CalendarClock} label="Hạn nộp hồ sơ">
              {formatDate(job.deadline)} <span className="font-normal text-muted-foreground">({deadlineLabel(job.deadline)})</span>
            </InfoRow>
          </ul>
        </aside>
      </div>
    </div>
  );
}
