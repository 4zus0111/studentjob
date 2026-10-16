"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/common/error-state";
import { FormCard, FormSkeleton } from "@/components/common/form-card";
import { TextareaField, TextField } from "@/components/form-fields";
import { useStudentProfile, useUpdateStudentProfile } from "@/hooks/use-student";
import { getErrorMessage, getFieldErrors } from "@/lib/helpers";
import { studentProfileSchema, toFormValues } from "@/lib/schemas/profile";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";

const FIELDS = ["fullName", "phone", "university", "major", "skills", "cvUrl"];

function Form({ profile }) {
  const update = useUpdateStudentProfile();
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: toFormValues(profile, FIELDS),
  });

  function onSubmit(values) {
    setServerError("");
    update.mutate(values, {
      onSuccess: (saved) => {
        form.reset(toFormValues(saved, FIELDS));
        // Keep the name shown in the navbar in sync
        const { accessToken, user, setAuth } = useAuthStore.getState();
        if (user) setAuth(accessToken, { ...user, displayName: saved.fullName });
        toast.success("Đã lưu hồ sơ");
      },
      onError: (error) => {
        Object.entries(getFieldErrors(error)).forEach(([name, message]) => {
          if (FIELDS.includes(name)) form.setError(name, { message });
        });
        setServerError(getErrorMessage(error));
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FormCard title="Thông tin cá nhân" description={`Email đăng nhập: ${profile.email}`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField form={form} name="fullName" label="Họ và tên" required autoComplete="name" />
          <TextField form={form} name="phone" label="Số điện thoại" type="tel" autoComplete="tel" />
        </div>
      </FormCard>

      <FormCard title="Học vấn và kỹ năng" description="Nhà tuyển dụng sẽ xem các thông tin này khi bạn ứng tuyển.">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField form={form} name="university" label="Trường đại học" placeholder="Đại học Bách Khoa" />
            <TextField form={form} name="major" label="Chuyên ngành" placeholder="Công nghệ thông tin" />
          </div>
          <TextareaField
            form={form}
            name="skills"
            label="Kỹ năng"
            rows={4}
            placeholder="Ví dụ: Java, Spring Boot, React, giao tiếp, làm việc nhóm..."
          />
          <TextField
            form={form}
            name="cvUrl"
            label="Link CV"
            type="url"
            placeholder="https://drive.google.com/..."
            hint="Dán đường dẫn tới CV của bạn (Google Drive, LinkedIn...). Hệ thống không hỗ trợ tải file lên."
          />
        </div>
      </FormCard>

      <div className="flex justify-end">
        <Button type="submit" className="h-10 px-6" disabled={update.isPending || !form.formState.isDirty}>
          {update.isPending ? <Loader2 className="animate-spin" /> : <Save />}
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}

export function StudentProfileForm() {
  const { data, isLoading, isError, error, refetch } = useStudentProfile();
  if (isLoading) return <FormSkeleton fields={6} />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  return <Form profile={data} />;
}
