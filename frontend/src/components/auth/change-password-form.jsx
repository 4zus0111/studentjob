"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, KeyRound, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/form-fields";
import { useChangePassword } from "@/hooks/use-auth";
import { getErrorMessage, getFieldErrors } from "@/lib/helpers";
import { changePasswordSchema } from "@/lib/schemas/auth";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function ChangePasswordForm() {
  const change = useChangePassword();
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  });

  function onSubmit({ currentPassword, newPassword }) {
    setServerError("");
    change.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Đã đổi mật khẩu");
          form.reset(EMPTY);
        },
        onError: (error) => {
          const message = error?.response?.data?.message;
          const fieldErrors = getFieldErrors(error);
          // These two failures belong to a specific field
          if (message === "Current password is incorrect") {
            form.setError("currentPassword", { message: getErrorMessage(error) });
          } else if (message === "New password must be different from the current password") {
            form.setError("newPassword", { message: getErrorMessage(error) });
          } else if (Object.keys(fieldErrors).length > 0) {
            Object.entries(fieldErrors).forEach(([name, text]) => {
              if (name in EMPTY) form.setError(name, { message: text });
            });
          } else {
            setServerError(getErrorMessage(error));
          }
        },
      },
    );
  }

  return (
    <section className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <KeyRound className="size-5" />
        </span>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">Đổi mật khẩu</h1>
          <p className="text-sm text-muted-foreground">
            Dùng mật khẩu mạnh, ít nhất 6 ký tự và không trùng với mật khẩu cũ.
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <PasswordField form={form} name="currentPassword" label="Mật khẩu hiện tại" icon={Lock} required autoComplete="current-password" />
        <PasswordField form={form} name="newPassword" label="Mật khẩu mới" icon={Lock} required autoComplete="new-password" placeholder="Tối thiểu 6 ký tự" />
        <PasswordField form={form} name="confirmPassword" label="Nhập lại mật khẩu mới" icon={Lock} required autoComplete="new-password" />

        <Button type="submit" className="h-10 w-full text-sm sm:w-auto sm:px-8" disabled={change.isPending}>
          {change.isPending && <Loader2 className="animate-spin" />}
          {change.isPending ? "Đang lưu..." : "Đổi mật khẩu"}
        </Button>
      </form>
    </section>
  );
}
