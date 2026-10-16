"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectField, TextareaField, TextField } from "@/components/form-fields";
import { useCreateJob, useUpdateJob } from "@/hooks/use-employer";
import { useCategories } from "@/hooks/use-jobs";
import { JOB_TYPE_LABELS } from "@/lib/format";
import { getErrorMessage, getFieldErrors } from "@/lib/helpers";
import {
  formValuesToJobRequest,
  JOB_DEFAULTS,
  jobSchema,
  jobToFormValues,
} from "@/lib/schemas/job";

const FIELD_NAMES = Object.keys(JOB_DEFAULTS);

function JobForm({ job, onDone }) {
  const isEdit = Boolean(job);
  const create = useCreateJob();
  const update = useUpdateJob();
  const pending = create.isPending || update.isPending;
  const { data: categories = [] } = useCategories();
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: isEdit ? jobToFormValues(job) : JOB_DEFAULTS,
  });

  function onSubmit(values) {
    setServerError("");
    const handlers = {
      onSuccess: () => {
        toast.success(isEdit ? "Đã cập nhật tin tuyển dụng" : "Đã đăng tin tuyển dụng");
        onDone();
      },
      onError: (error) => {
        Object.entries(getFieldErrors(error)).forEach(([name, message]) => {
          if (FIELD_NAMES.includes(name)) form.setError(name, { message });
        });
        setServerError(getErrorMessage(error));
      },
    };
    if (isEdit) {
      // A job hidden by an admin keeps its status: do not send one
      const request = formValuesToJobRequest(values, { includeStatus: job.status !== "HIDDEN" });
      update.mutate({ id: job.id, ...request }, handlers);
    } else {
      create.mutate(formValuesToJobRequest(values, { includeStatus: false }), handlers);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      {isEdit && job.status === "HIDDEN" && (
        <Alert>
          <AlertCircle />
          <AlertDescription>Tin này đang bị quản trị viên ẩn nên không hiển thị công khai.</AlertDescription>
        </Alert>
      )}

      <TextField form={form} name="title" label="Tiêu đề" required placeholder="Thực tập sinh Frontend ReactJS" />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          form={form}
          name="categoryId"
          label="Danh mục"
          required
          placeholder="Chọn danh mục"
          options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
        />
        <SelectField
          form={form}
          name="jobType"
          label="Loại hình"
          required
          placeholder="Chọn loại hình"
          options={Object.entries(JOB_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField form={form} name="location" label="Địa điểm" placeholder="Quận 1, TP. Hồ Chí Minh" />
        <TextField form={form} name="deadline" label="Hạn nộp hồ sơ" type="date" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          form={form}
          name="salaryMin"
          label="Lương tối thiểu (VNĐ/tháng)"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="3000000"
        />
        <TextField
          form={form}
          name="salaryMax"
          label="Lương tối đa (VNĐ/tháng)"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="5000000"
          hint="Để trống cả hai ô nếu lương thỏa thuận."
        />
      </div>

      <TextareaField form={form} name="description" label="Mô tả công việc" required rows={6} />
      <TextareaField form={form} name="requirements" label="Yêu cầu ứng viên" rows={5} />

      {isEdit && job.status !== "HIDDEN" && (
        <SelectField
          form={form}
          name="status"
          label="Trạng thái tin"
          options={[
            { value: "OPEN", label: "Đang tuyển" },
            { value: "CLOSED", label: "Đã đóng (ngừng nhận hồ sơ)" },
          ]}
        />
      )}

      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onDone}>
          Hủy
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          {isEdit ? "Lưu thay đổi" : "Đăng tin"}
        </Button>
      </DialogFooter>
    </form>
  );
}

/** Create (job = null) or edit a job posting. The form is mounted only while open, so it resets each time. */
export function JobFormDialog({ open, onOpenChange, job }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}</DialogTitle>
          <DialogDescription>
            {job ? "Cập nhật thông tin và trạng thái của tin." : "Tin được hiển thị công khai ngay sau khi đăng."}
          </DialogDescription>
        </DialogHeader>
        <JobForm job={job} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
