import { Skeleton } from "@/components/ui/skeleton";

export function FormCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-5 space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function FormSkeleton({ fields = 5 }) {
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-6" aria-busy="true">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
