"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  GraduationCap,
  Mail,
  Phone,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { Pager } from "@/components/common/pager";
import { StatusBadge } from "@/components/common/status-badge";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { useApplicants, useEmployerProfile, useUpdateApplicationStatus } from "@/hooks/use-employer";
import { useJob } from "@/hooks/use-jobs";
import { formatDateTime } from "@/lib/format";
import { getErrorMessage, getInitials } from "@/lib/helpers";

export function ApplicantsList({ jobId }) {
  const [page, setPage] = useState(0);
  const [pendingAction, setPendingAction] = useState(null); // { applicant, status }

  const { data: profile } = useEmployerProfile();
  const { data: job } = useJob(jobId);
  const { data, isLoading, isError, error, refetch } = useApplicants(jobId, { page, size: 10 });
  const updateStatus = useUpdateApplicationStatus();
  const approved = profile?.status === "ACTIVE";

  function confirm() {
    const { applicant, status } = pendingAction;
    updateStatus.mutate(
      { id: applicant.id, status },
      {
        onSuccess: () => {
          toast.success(status === "ACCEPTED" ? "Đã chấp nhận hồ sơ" : "Đã từ chối hồ sơ");
          setPendingAction(null);
        },
        onError: (e) => {
          toast.error(getErrorMessage(e));
          setPendingAction(null);
        },
      },
    );
  }

  const accepting = pendingAction?.status === "ACCEPTED";

  return (
    <div className="space-y-6">
      <Link href="/employer/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Quay lại tin tuyển dụng
      </Link>
      <PageHeader
        title="Ứng viên"
        description={job ? `Vị trí: ${job.title}` : "Danh sách sinh viên đã ứng tuyển vào tin này."}
      />

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <TableSkeleton rows={3} />
      ) : data.content.length === 0 ? (
        <EmptyState icon={Users} title="Chưa có ứng viên nào" description="Hồ sơ sinh viên ứng tuyển sẽ xuất hiện tại đây." />
      ) : (
        <div className="space-y-3">
          {data.content.map((a) => (
            <article key={a.id} className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {getInitials(a.fullName)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{a.fullName}</p>
                    <p className="text-xs text-muted-foreground">Ứng tuyển {formatDateTime(a.createdAt)}</p>
                  </div>
                </div>
                <StatusBadge kind="application" value={a.status} />
              </div>

              <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0" />
                  <a href={`mailto:${a.email}`} className="truncate hover:text-foreground hover:underline">{a.email}</a>
                </li>
                {a.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0" /> {a.phone}
                  </li>
                )}
                {(a.university || a.major) && (
                  <li className="flex items-center gap-2 sm:col-span-2">
                    <GraduationCap className="size-4 shrink-0" />
                    {[a.university, a.major].filter(Boolean).join(" · ")}
                  </li>
                )}
              </ul>

              {a.skills && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Kỹ năng</p>
                  <p className="text-sm whitespace-pre-line">{a.skills}</p>
                </div>
              )}
              {a.coverLetter && (
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-primary">Thư giới thiệu</summary>
                  <p className="mt-2 rounded-lg bg-muted p-3 whitespace-pre-line">{a.coverLetter}</p>
                </details>
              )}

              <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                {a.cvUrl ? (
                  <a
                    href={a.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
                  >
                    <ExternalLink className="size-4" /> Xem CV
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Chưa có link CV</span>
                )}
                {a.status === "PENDING" && (
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      className="h-9 text-destructive"
                      disabled={!approved}
                      onClick={() => setPendingAction({ applicant: a, status: "REJECTED" })}
                    >
                      <X /> Từ chối
                    </Button>
                    <Button
                      className="h-9"
                      disabled={!approved}
                      onClick={() => setPendingAction({ applicant: a, status: "ACCEPTED" })}
                    >
                      <Check /> Chấp nhận
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ))}
          <Pager page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => !open && !updateStatus.isPending && setPendingAction(null)}
        title={accepting ? "Chấp nhận hồ sơ?" : "Từ chối hồ sơ?"}
        description={`${pendingAction?.applicant.fullName ?? ""}: quyết định này không thể thay đổi sau khi xác nhận.`}
        confirmLabel={accepting ? "Chấp nhận" : "Từ chối"}
        destructive={!accepting}
        loading={updateStatus.isPending}
        onConfirm={confirm}
      />
    </div>
  );
}
