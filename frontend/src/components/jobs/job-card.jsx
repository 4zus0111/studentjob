import Link from "next/link";
import { Banknote, CalendarClock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/jobs/company-logo";
import { daysLeft, deadlineLabel, formatSalary, JOB_TYPE_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";

export function JobCard({ job }) {
  const left = daysLeft(job.deadline);
  const urgent = left !== null && left >= 0 && left <= 3;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="flex items-start gap-3">
        <CompanyLogo name={job.companyName} url={job.companyLogoUrl} />
        <div className="min-w-0 space-y-0.5">
          <h3 className="line-clamp-2 leading-snug font-semibold group-hover:text-primary">{job.title}</h3>
          <p className="truncate text-sm text-muted-foreground">{job.companyName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge className="bg-accent text-accent-foreground">{JOB_TYPE_LABELS[job.jobType]}</Badge>
        <Badge variant="outline">{job.category?.name}</Badge>
      </div>

      <ul className="mt-auto space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Banknote className="size-4 shrink-0" />
          <span className="font-medium text-foreground">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </li>
        {job.location && (
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{job.location}</span>
          </li>
        )}
        <li className={cn("flex items-center gap-2", urgent && "font-medium text-destructive")}>
          <CalendarClock className="size-4 shrink-0" />
          {deadlineLabel(job.deadline)}
        </li>
      </ul>
    </Link>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5" aria-hidden="true">
      <div className="flex gap-3">
        <div className="size-12 animate-pulse rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
      <div className="space-y-2">
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
