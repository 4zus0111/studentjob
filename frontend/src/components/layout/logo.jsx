import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="StudentJob - Trang chủ">
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:-rotate-6",
          light ? "bg-white/15 text-white ring-1 ring-white/25" : "bg-primary text-primary-foreground",
        )}
      >
        <GraduationCap className="size-5" />
      </span>
      <span className={cn("text-lg font-bold tracking-tight", light ? "text-white" : "text-foreground")}>
        Student<span className={light ? "text-amber-300" : "text-primary"}>Job</span>
      </span>
    </Link>
  );
}
