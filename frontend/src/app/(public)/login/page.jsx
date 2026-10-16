import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Đăng nhập" };

export default function LoginPage() {
  // useSearchParams (for ?next=) needs a Suspense boundary
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
