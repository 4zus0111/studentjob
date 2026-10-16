import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Đăng ký" };

export default function RegisterPage() {
  // useSearchParams (for ?type=employer) needs a Suspense boundary
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
