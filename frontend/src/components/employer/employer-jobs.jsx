"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { Pager } from "@/components/common/pager";
import { StatusBadge } from "@/components/common/status-badge";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { JobFormDialog } from "@/components/employer/job-form-dialog";
import { useDeleteJob, useEmployerProfile, useMyJobs } from "@/hooks/use-employer";
import { formatDate, formatSalary, JOB_TYPE_LABELS } from "@/lib/format";
import { getErrorMessage } from "@/lib/helpers";
import { cn } from "@/lib/utils";

export function EmployerJobs() {
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data: profile } = useEmployerProfile();
  const { data, isLoading, isError, error, refetch } = useMyJobs({ page, size: 10 });
  const deleteJob = useDeleteJob();

  // Fresh status from the server (the session copy may be stale after an admin approves)
  const approved = profile?.status === "ACTIVE";

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(job) {
    setEditing(job);
    setFormOpen(true);
  }
  function confirmDelete() {
    if (!deleting) return;

    deleteJob.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Đã xóa tin tuyển dụng");
        setDeleting(null);
        if (data?.content.length === 1 && page > 0) {
          setPage(page - 1);
        }
      },
      onError: (e) => {
        toast.error(getErrorMessage(e));
        setDeleting(null);
      },
    });
  }

  const createButton = (
    <Button className="h-10" onClick={openCreate} disabled={!approved} title={approved ? undefined : "Cần được quản trị viên duyệt trước"}>
      <Plus /> Đăng tin mới
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Tin tuyển dụng" description="Quản lý các vị trí bạn đang tuyển." actions={createButton} />

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <TableSkeleton />
      ) : data.content.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Bạn chưa đăng tin tuyển dụng nào"
          description={approved ? "Đăng tin đầu tiên để bắt đầu nhận hồ sơ từ sinh viên." : "Sau khi tài khoản được duyệt, bạn có thể đăng tin tại đây."}
          action={approved ? createButton : undefined}
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vị trí</TableHead>
                  <TableHead className="hidden md:table-cell">Loại hình</TableHead>
                  <TableHead className="hidden lg:table-cell">Mức lương</TableHead>
                  <TableHead className="hidden sm:table-cell">Hạn nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="max-w-64 whitespace-normal">
                      <Link href={`/jobs/${job.id}`} className="line-clamp-2 font-medium hover:text-primary hover:underline">
                        {job.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{job.category?.name}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{JOB_TYPE_LABELS[job.jobType]}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatSalary(job.salaryMin, job.salaryMax)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDate(job.deadline)}</TableCell>
                    <TableCell>
                      <StatusBadge kind="job" value={job.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/employer/jobs/${job.id}/applicants`}
                          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8")}
                          title="Xem ứng viên"
                        >
                          <Users /> <span className="hidden xl:inline">Ứng viên</span>
                        </Link>
                        <Button variant="ghost" size="icon-sm" aria-label="Sửa tin" disabled={!approved} onClick={() => openEdit(job)}>
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Xóa tin"
                          className="text-destructive hover:text-destructive"
                          disabled={!approved}
                          onClick={() => setDeleting(job)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pager page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onChange={setPage} />
        </>
      )}

      <JobFormDialog open={formOpen} onOpenChange={setFormOpen} job={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && !deleteJob.isPending && setDeleting(null)}
        title="Xóa tin tuyển dụng?"
        description={`Tin "${deleting?.title ?? ""}" sẽ bị xóa vĩnh viễn. Nếu tin đã có hồ sơ ứng tuyển, bạn nên chuyển sang "Đã đóng" thay vì xóa.`}
        confirmLabel="Xóa tin"
        destructive
        loading={deleteJob.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
