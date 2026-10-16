import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2 rounded-2xl border bg-card p-4" aria-busy="true">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
