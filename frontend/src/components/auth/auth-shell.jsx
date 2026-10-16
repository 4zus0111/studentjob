import { BriefcaseBusiness, CheckCircle2, GraduationCap } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const POINTS = [
  { icon: GraduationCap, text: "Tìm thực tập và việc làm phù hợp với chuyên ngành" },
  { icon: BriefcaseBusiness, text: "Ứng tuyển nhanh chỉ với một hồ sơ duy nhất" },
  { icon: CheckCircle2, text: "Theo dõi trạng thái đơn ứng tuyển theo thời gian thực" },
];

/** Two-column frame shared by /login and /register: brand panel on the left, form on the right. */
export function AuthShell({ title, description, children, footer }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid w-full overflow-hidden rounded-3xl border bg-card shadow-xl shadow-primary/5 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-primary to-teal-900 p-10 text-primary-foreground lg:flex">
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-amber-300/20 blur-3xl" />

          <Logo light className="relative" />

          <div className="relative space-y-6">
            <h2 className="text-3xl leading-tight font-bold tracking-tight text-balance">
              Bước đầu sự nghiệp bắt đầu từ đây
            </h2>
            <ul className="space-y-4">
              {POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-white/90">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <Icon className="size-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-xs text-white/70">StudentJob · Kết nối sinh viên và nhà tuyển dụng</p>
        </aside>

        <section className="p-6 sm:p-10">
          <div className="mb-6 space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {children}
          {footer && <div className="mt-6 border-t pt-5 text-center text-sm text-muted-foreground">{footer}</div>}
        </section>
      </div>
    </div>
  );
}
