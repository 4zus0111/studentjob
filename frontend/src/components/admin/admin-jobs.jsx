"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { FilterTabs } from "@/components/common/filter-tabs";
import { PageHeader } from "@/components/common/page-header";
import { Pager } from "@/components/common/pager";
import { StatusBadge } from "@/components/common/status-badge";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { useAdminJobs, useSetJobHidden } from "@/hooks/use-admin";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/lib/helpers";

const TABS = [
  { value: "", label: "Tất cả" },
  { value: "OPEN", label: "Đang tuyển" },
  { value: "CLOSED", label: "Đã đóng" },
  { value: "HIDDEN", label: "Bị ẩn" },
];

export function AdminJobs() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [target, setTarget] = useState(null); // job to hide / unhide

  const { data, isLoading, isError, error, refetch } = useAdminJobs({ status, page, size: 10 });
  const setHidden = useSetJobHidden();
  const hiding = target ? target.status !== "HIDDEN" : true;

  function confirm() {
    if (!target) return;

    setHidden.mutate(
      { id: target.id, hidden: hiding },
      {
        onSuccess: () => {
          toast.success(
            hiding
              ? "Đã ẩn tin tuyển dụng"
              : "Đã hiển thị lại tin tuyển dụng",
          );
          setTarget(null);
        },
        onError: (e) => {
          toast.error(getErrorMessage(e));
          setTarget(null);
        },
      },
    );
  }


  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý tin đăng" description="Ẩn các tin vi phạm khỏi trang tìm kiếm công khai." />
      <FilterTabs
        label="Lọc theo trạng thái"
        options={TABS}
        value={status}
        onChange={(v) => {
          setStatus(v);
          setPage(0);
        }}
      />

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <TableSkeleton />
      ) : data.content.length === 0 ? (
        <EmptyState icon={Briefcase} title="Không có tin tuyển dụng nào" />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vị trí</TableHead>
                  <TableHead className="hidden md:table-cell">Công ty</TableHead>
                  <TableHead className="hidden sm:table-cell">Hạn nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="max-w-64 whitespace-normal">
                      {job.status === "HIDDEN" ? (
                        <span className="line-clamp-2 font-medium">{job.title}</span>
                      ) : (
                        <Link href={`/jobs/${job.id}`} className="line-clamp-2 font-medium hover:text-primary hover:underline">
                          {job.title}
                        </Link>
                      )}
                      <p className="text-xs text-muted-foreground md:hidden">{job.companyName}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{job.companyName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDate(job.deadline)}</TableCell>
                    <TableCell>
                      <StatusBadge kind="job" value={job.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        {job.status === "HIDDEN" ? (
                          <Button variant="outline" size="sm" className="h-8" onClick={() => setTarget(job)}>
                            <Eye /> Hiện
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="h-8 text-destructive" onClick={() => setTarget(job)}>
                            <EyeOff /> Ẩn
                          </Button>
                        )}
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

      <ConfirmDialog
        open={Boolean(target)}
        onOpenChange={(open) => !open && !setHidden.isPending && setTarget(null)}
        title={hiding ? "Ẩn tin tuyển dụng?" : "Hiển thị lại tin?"}
        description={
          hiding
            ? `Tin "${target?.title ?? ""}" sẽ không còn xuất hiện công khai và không nhận thêm hồ sơ.`
            : `Tin "${target?.title ?? ""}" sẽ được mở lại (trạng thái đang tuyển).`
        }
        confirmLabel={hiding ? "Ẩn tin" : "Hiển thị"}
        destructive={hiding}
        loading={setHidden.isPending}
        onConfirm={confirm}
      />
    </div>
  );
}
