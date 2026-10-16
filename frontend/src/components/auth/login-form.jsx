"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GuestOnly } from "@/components/auth/role-guard";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordField, TextField } from "@/components/form-fields";
import { useLogin } from "@/hooks/use-auth";
import { getErrorMessage, getFieldErrors, safeNext } from "@/lib/helpers";
import { loginSchema } from "@/lib/schemas/auth";

export function LoginForm() {
  const next = safeNext(useSearchParams().get("next"));
  const login = useLogin();
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values) {
    setServerError("");
    login.mutate(values, {
      onSuccess: ({ user }) => {
        // GuestOnly redirects once the store has the user
        toast.success(`Xin chào, ${user.displayName}!`);
      },
      onError: (error) => {
        const fieldErrors = getFieldErrors(error);
        Object.entries(fieldErrors).forEach(([name, message]) => {
          if (name in values) form.setError(name, { message });
        });
        setServerError(getErrorMessage(error));
      },
    });
  }

  return (
    <GuestOnly redirectTo={next}>
      <AuthShell
        title="Đăng nhập"
        description="Chào mừng bạn quay lại! Vui lòng nhập thông tin tài khoản."
        footer={
          <>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </>
        }
      >
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          {serverError && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <TextField
            form={form}
            name="email"
            label="Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="ten@example.com"
          />
          <PasswordField
            form={form}
            name="password"
            label="Mật khẩu"
            icon={Lock}
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
          />

          <Button type="submit" className="h-10 w-full text-sm" disabled={login.isPending}>
            {login.isPending && <Loader2 className="animate-spin" />}
            {login.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </AuthShell>
    </GuestOnly>
  );
}
