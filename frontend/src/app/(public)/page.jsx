import Link from "next/link";
import { Building2, ClipboardCheck, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HomeSearch } from "@/components/jobs/home-search";
import { LatestJobs } from "@/components/jobs/latest-jobs";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Search, title: "Tìm việc dễ dàng", text: "Lọc theo ngành nghề, loại hình, địa điểm và mức lương." },
  { icon: ClipboardCheck, title: "Ứng tuyển nhanh", text: "Hoàn thiện hồ sơ một lần, ứng tuyển nhiều vị trí." },
  { icon: Building2, title: "Nhà tuyển dụng uy tín", text: "Doanh nghiệp được quản trị viên xét duyệt trước khi đăng tin." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-linear-to-b from-accent/70 via-background to-background">
        <div className="pointer-events-none absolute -top-32 right-0 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-24">
          <span className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-primary shadow-sm">
            Dành riêng cho sinh viên
          </span>
          <h1 className="max-w-3xl text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
            Tìm thực tập và việc làm <span className="text-primary">phù hợp với bạn</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            StudentJob kết nối sinh viên với các nhà tuyển dụng đang cần thực tập sinh, nhân viên bán thời gian và toàn thời gian.
          </p>
          <HomeSearch />
          <Link
            href="/register?type=employer"
            className={cn(buttonVariants({ variant: "ghost" }), "text-muted-foreground")}
          >
            Bạn là nhà tuyển dụng? Đăng ký tuyển dụng
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border bg-card p-6 shadow-sm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <LatestJobs />
    </>
  );
}
