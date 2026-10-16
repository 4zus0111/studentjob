"use client";

import { useState } from "react";
import { Building2, Check, X } from "lucide-react";
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
import { useAdminEmployers, useDecideEmployer } from "@/hooks/use-admin";
import { formatDateTime } from "@/lib/format";
import { getErrorMessage } from "@/lib/helpers";

const TABS = [
  { value: "PENDING_APPROVAL", label: "Chờ duyệt" },
  { value: "ACTIVE", label: "Đã duyệt" },
  { value: "LOCKED", label: "Đã khóa / từ chối" },
  { value: "", label: "Tất cả" },
];

export function AdminEmployers() {
  const [status, setStatus] = useState("PENDING_APPROVAL");
  const [page, setPage] = useState(0);
  const [action, setAction] = useState(null); // { employer, approved }

  const { data, isLoading, isError, error, refetch } = useAdminEmployers({ status, page, size: 10 });
  const decide = useDecideEmployer();

  function confirm() {
    const { employer, approved } = action;
    decide.mutate(
      { userId: employer.userId, approved },
      {
        onSuccess: () => {
          toast.success(approved ? "Đã duyệt nhà tuyển dụng" : "Đã từ chối nhà tuyển dụng");
          setAction(null);
        },
        onError: (e) => {
          toast.error(getErrorMessage(e));
          setAction(null);
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Duyệt nhà tuyển dụng" description="Nhà tuyển dụng chỉ đăng tin được sau khi bạn duyệt." />
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
        <EmptyState icon={Building2} title="Không có nhà tuyển dụng nào" description="Chưa có tài khoản nào ở trạng thái này." />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Công ty</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Ngày đăng ký</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((e) => (
                  <TableRow key={e.userId}>
                    <TableCell className="max-w-56 whitespace-normal">
                      <p className="font-medium">{e.companyName}</p>
                      {e.website && <p className="truncate text-xs text-muted-foreground">{e.website}</p>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{e.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDateTime(e.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge kind="user" value={e.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {e.status === "PENDING_APPROVAL" && (
                          <>
                            <Button variant="outline" size="sm" className="h-8 text-destructive" onClick={() => setAction({ employer: e, approved: false })}>
                              <X /> Từ chối
                            </Button>
                            <Button size="sm" className="h-8" onClick={() => setAction({ employer: e, approved: true })}>
                              <Check /> Duyệt
                            </Button>
                          </>
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
        open={Boolean(action)}
        onOpenChange={(open) => !open && !decide.isPending && setAction(null)}
        title={action?.approved ? "Duyệt nhà tuyển dụng?" : "Từ chối nhà tuyển dụng?"}
        description={
          action?.approved
            ? `${action?.employer.companyName} sẽ được phép đăng tin tuyển dụng.`
            : `Tài khoản của ${action?.employer.companyName ?? ""} sẽ bị khóa và không thể đăng nhập.`
        }
        confirmLabel={action?.approved ? "Duyệt" : "Từ chối"}
        destructive={action ? !action.approved : false}
        loading={decide.isPending}
        onConfirm={confirm}
      />
    </div>
  );
}
