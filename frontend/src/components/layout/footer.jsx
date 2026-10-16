import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Nền tảng kết nối sinh viên với nhà tuyển dụng: thực tập, bán thời gian và toàn thời gian.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold">Sinh viên</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/jobs" className="hover:text-foreground">Tìm việc làm</Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-foreground">Tạo tài khoản</Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold">Nhà tuyển dụng</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/register?type=employer" className="hover:text-foreground">Đăng ký tuyển dụng</Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground">Đăng nhập</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          © StudentJob · Đồ án môn học
        </p>
      </div>
    </footer>
  );
}
