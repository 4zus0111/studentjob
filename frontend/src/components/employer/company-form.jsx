"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/common/error-state";
import { FormCard, FormSkeleton } from "@/components/common/form-card";
import { CompanyLogo } from "@/components/jobs/company-logo";
import { TextareaField, TextField } from "@/components/form-fields";
import { useEmployerProfile, useUpdateEmployerProfile } from "@/hooks/use-employer";
import { getErrorMessage, getFieldErrors } from "@/lib/helpers";
import { employerProfileSchema, toFormValues } from "@/lib/schemas/profile";
import { useAuthStore } from "@/store/auth-store";

const FIELDS = ["companyName", "description", "website", "address", "logoUrl"];

function Form({ profile }) {
  const update = useUpdateEmployerProfile();
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: toFormValues(profile, FIELDS),
  });
  const logoUrl = form.watch("logoUrl");
  const companyName = form.watch("companyName");

  function onSubmit(values) {
    setServerError("");
    update.mutate(values, {
      onSuccess: (saved) => {
        form.reset(toFormValues(saved, FIELDS));
        const { accessToken, user, setAuth } = useAuthStore.getState();
        if (user) setAuth(accessToken, { ...user, displayName: saved.companyName });
        toast.success("Đã lưu hồ sơ công ty");
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

      <FormCard title="Thông tin công ty" description={`Email đăng nhập: ${profile.email}`}>
        <div className="space-y-4">
          <TextField form={form} name="companyName" label="Tên công ty" required autoComplete="organization" />
          <TextareaField
            form={form}
            name="description"
            label="Giới thiệu công ty"
            rows={5}
            placeholder="Lĩnh vực hoạt động, quy mô, văn hóa làm việc..."
          />
          <TextField form={form} name="address" label="Địa chỉ" placeholder="Số nhà, đường, quận, thành phố" />
        </div>
      </FormCard>

      <FormCard title="Website và logo" description="Logo hiển thị trên các tin tuyển dụng của bạn.">
        <div className="space-y-4">
          <TextField form={form} name="website" label="Website" type="url" placeholder="https://congty.com" />
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <TextField
                form={form}
                name="logoUrl"
                label="Link logo"
                type="url"
                placeholder="https://congty.com/logo.png"
                hint="Dán đường dẫn ảnh logo. Hệ thống không hỗ trợ tải file lên."
              />
            </div>
            <CompanyLogo key={logoUrl} name={companyName} url={logoUrl?.trim()} className="mb-6" />
          </div>
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

export function CompanyForm() {
  const { data, isLoading, isError, error, refetch } = useEmployerProfile();
  if (isLoading) return <FormSkeleton fields={5} />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  return <Form profile={data} />;
}
