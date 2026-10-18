import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

export const metadata = { title: "Không tìm thấy trang" };

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <Logo />
      <span className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Compass className="size-8" />
      </span>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Không tìm thấy trang</h1>
        <p className="max-w-md text-muted-foreground">Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.</p>
      </div>
      <div className="flex gap-3">
        <Link href="/" className={cn(buttonVariants(), "h-10 px-5")}>
          Về trang chủ
        </Link>
        <Link href="/jobs" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-5")}>
          Xem việc làm
        </Link>
      </div>
    </main>
  );
}
