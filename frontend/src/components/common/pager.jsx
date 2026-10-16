import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Simple previous / next pager. `page` is 0-based (as in the API). */
export function Pager({ page, totalPages, totalElements, onChange }) {
  if (!totalPages || totalPages <= 1) {
    return totalElements > 0 ? (
      <p className="text-center text-sm text-muted-foreground">{totalElements} kết quả</p>
    ) : null;
  }

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <p className="hidden text-sm text-muted-foreground sm:block">{totalElements} kết quả</p>
      <div className="mx-auto flex items-center gap-2 sm:mx-0">
        <Button variant="outline" className="h-9" disabled={page <= 0} onClick={() => onChange(page - 1)}>
          <ChevronLeft /> Trước
        </Button>
        <span className="min-w-24 text-center text-sm font-medium">
          Trang {page + 1} / {totalPages}
        </span>
        <Button variant="outline" className="h-9" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>
          Sau <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
