"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Building2,
  Clock,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthShell } from "@/components/auth/auth-shell";
import { GuestOnly } from "@/components/auth/role-guard";
import { PasswordField, TextField } from "@/components/form-fields";
import { useRegisterEmployer, useRegisterStudent } from "@/hooks/use-auth";
import { getErrorMessage, getFieldErrors } from "@/lib/helpers";
import { registerEmployerSchema, registerStudentSchema } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

/** Shared submit logic: maps backend validation errors onto the form fields. */
function useServerErrors(form) {
  const [serverError, setServerError] = useState("");

  function handleError(error, values) {
    Object.entries(getFieldErrors(error)).forEach(([name, message]) => {
      if (name in values) form.setError(name, { message });
    });
    setServerError(getErrorMessage(error));
  }

  return { serverError, setServerError, handleError };
}

function ServerError({ message }) {
  if (!message) return null;
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function StudentForm() {
  const router = useRouter();
  const register = useRegisterStudent();
  const form = useForm({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "" },
  });
  const { serverError, setServerError, handleError } = useServerErrors(form);

  function onSubmit({ confirmPassword: _confirm, ...payload }) {
    setServerError("");
    register.mutate(payload, {
      onSuccess: () => {
        toast.success("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
        router.push("/login");
      },
      onError: (error) => handleError(error, payload),
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
      <ServerError message={serverError} />
      <TextField form={form} name="fullName" label="Họ và tên" icon={UserRound} required autoComplete="name" placeholder="Nguyễn Văn A" />
      <TextField form={form} name="email" label="Email" type="email" icon={Mail} required autoComplete="email" placeholder="ten@example.com" />
      <TextField form={form} name="phone" label="Số điện thoại" type="tel" icon={Phone} autoComplete="tel" placeholder="0901234567" hint="Không bắt buộc" />
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordField form={form} name="password" label="Mật khẩu" icon={Lock} required autoComplete="new-password" placeholder="Tối thiểu 6 ký tự" />
        <PasswordField form={form} name="confirmPassword" label="Nhập lại mật khẩu" icon={Lock} required autoComplete="new-password" placeholder="Nhập lại mật khẩu" />
      </div>
      <Button type="submit" className="h-10 w-full text-sm" disabled={register.isPending}>
        {register.isPending && <Loader2 className="animate-spin" />}
        {register.isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản sinh viên"}
      </Button>
    </form>
  );
}

function EmployerPendingNotice() {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <Clock className="size-7" />
      </span>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold">Đăng ký thành công!</h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Tài khoản nhà tuyển dụng của bạn đang chờ quản trị viên phê duyệt. Bạn có thể đăng nhập ngay,
          nhưng chỉ đăng tin tuyển dụng được sau khi tài khoản được duyệt.
        </p>
      </div>
      <Link href="/login" className={cn(buttonVariants(), "h-10 px-6")}>
        Đến trang đăng nhập
      </Link>
    </div>
  );
}

function EmployerForm({ onDone }) {
  const register = useRegisterEmployer();
  const form = useForm({
    resolver: zodResolver(registerEmployerSchema),
    defaultValues: { companyName: "", email: "", password: "", confirmPassword: "" },
  });
  const { serverError, setServerError, handleError } = useServerErrors(form);

  function onSubmit({ confirmPassword: _confirm, ...payload }) {
    setServerError("");
    register.mutate(payload, {
      onSuccess: () => onDone(),
      onError: (error) => handleError(error, payload),
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Alert>
        <Clock />
        <AlertTitle>Cần quản trị viên duyệt</AlertTitle>
        <AlertDescription>Tài khoản nhà tuyển dụng sẽ ở trạng thái chờ duyệt sau khi đăng ký.</AlertDescription>
      </Alert>
      <ServerError message={serverError} />
      <TextField form={form} name="companyName" label="Tên công ty" icon={Building2} required autoComplete="organization" placeholder="Công ty TNHH ABC" />
      <TextField form={form} name="email" label="Email" type="email" icon={Mail} required autoComplete="email" placeholder="hr@congty.com" />
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordField form={form} name="password" label="Mật khẩu" icon={Lock} required autoComplete="new-password" placeholder="Tối thiểu 6 ký tự" />
        <PasswordField form={form} name="confirmPassword" label="Nhập lại mật khẩu" icon={Lock} required autoComplete="new-password" placeholder="Nhập lại mật khẩu" />
      </div>
      <Button type="submit" className="h-10 w-full text-sm" disabled={register.isPending}>
        {register.isPending && <Loader2 className="animate-spin" />}
        {register.isPending ? "Đang gửi đăng ký..." : "Đăng ký nhà tuyển dụng"}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const initialTab = useSearchParams().get("type") === "employer" ? "employer" : "student";
  const [tab, setTab] = useState(initialTab);
  const [employerDone, setEmployerDone] = useState(false);

  return (
    <GuestOnly>
      <AuthShell
        title="Tạo tài khoản"
        description="Chọn loại tài khoản phù hợp với bạn."
        footer={
          <>
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Đăng nhập
            </Link>
          </>
        }
      >
        {employerDone ? (
          <EmployerPendingNotice />
        ) : (
          <Tabs value={tab} onValueChange={setTab} className="gap-5">
            <TabsList className="grid h-11! w-full grid-cols-2">
              <TabsTrigger value="student" className="gap-2">
                <GraduationCap /> Sinh viên
              </TabsTrigger>
              <TabsTrigger value="employer" className="gap-2">
                <Building2 /> Nhà tuyển dụng
              </TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <StudentForm />
            </TabsContent>
            <TabsContent value="employer">
              <EmployerForm onDone={() => setEmployerDone(true)} />
            </TabsContent>
          </Tabs>
        )}
      </AuthShell>
    </GuestOnly>
  );
}
