"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Company logo (external URL) with a lettered fallback when it is missing or fails to load. */
export function CompanyLogo({ name = "", url, className }) {
  const [failed, setFailed] = useState(false);
  const base = "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-accent text-lg font-bold text-accent-foreground";

  if (url && !failed) {
    return (
      // External, user supplied URL: next/image would need every host whitelisted
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={name} onError={() => setFailed(true)} className={cn(base, "bg-white object-contain p-1", className)} />
    );
  }
  return <span className={cn(base, className)}>{(name.trim()[0] ?? "?").toUpperCase()}</span>;
}
