"use client";

import { useState } from "react";
import { Lock, LockOpen, Users } from "lucide-react";
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
import { useAdminUsers, useSetUserLocked } from "@/hooks/use-admin";
import { formatDateTime } from "@/lib/format";
import { getErrorMessage, ROLE_LABELS } from "@/lib/helpers";

const TABS = [
  { value: "", label: "Tất cả" },
  { value: "STUDENT", label: "Sinh viên" },
  { value: "EMPLOYER", label: "Nhà tuyển dụng" },
  { value: "ADMIN", label: "Quản trị viên" },
];

export function AdminUsers() {
  const [role, setRole] = useState("");
  const [page, setPage] = useState(0);
  const [target, setTarget] = useState(null);

  const { data, isLoading, isError, error, refetch } = useAdminUsers({ role, page, size: 10 });
  const setLocked = useSetUserLocked();
  const locking = target ? target.status !== "LOCKED" : true;

  function confirm() {
    if (!target) return;

    setLocked.mutate(
      { id: target.id, locked: locking },
      {
        onSuccess: () => {
          toast.success(
            locking
              ? "Đã khóa tài khoản"
              : "Đã mở khóa tài khoản",
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
      <PageHeader title="Quản lý người dùng" description="Khóa tài khoản vi phạm hoặc mở khóa khi cần." />
      <FilterTabs
        label="Lọc theo vai trò"
        options={TABS}
        value={role}
        onChange={(v) => {
          setRole(v);
          setPage(0);
        }}
      />

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <TableSkeleton />
      ) : data.content.length === 0 ? (
        <EmptyState icon={Users} title="Không có người dùng nào" />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead className="hidden sm:table-cell">Vai trò</TableHead>
                  <TableHead className="hidden lg:table-cell">Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="max-w-56 whitespace-normal">
                      <p className="truncate font-medium">{u.displayName}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{ROLE_LABELS[u.role]}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDateTime(u.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge kind="user" value={u.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        {u.role !== "ADMIN" &&
                          (u.status === "LOCKED" ? (
                            <Button variant="outline" size="sm" className="h-8" onClick={() => setTarget(u)}>
                              <LockOpen /> Mở khóa
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="h-8 text-destructive" onClick={() => setTarget(u)}>
                              <Lock /> Khóa
                            </Button>
                          ))}
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
        onOpenChange={(open) => !open && !setLocked.isPending && setTarget(null)}
        title={locking ? "Khóa tài khoản?" : "Mở khóa tài khoản?"}
        description={
          locking
            ? `${target?.displayName ?? ""} sẽ không thể đăng nhập cho tới khi được mở khóa.`
            : `${target?.displayName ?? ""} sẽ có thể đăng nhập trở lại.`
        }
        confirmLabel={locking ? "Khóa" : "Mở khóa"}
        destructive={locking}
        loading={setLocked.isPending}
        onConfirm={confirm}
      />
    </div>
  );
}
