"use client";

import { useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SELECT_CLASS } from "@/components/form-fields";
import { useCategories } from "@/hooks/use-jobs";
import { JOB_TYPE_LABELS } from "@/lib/format";

const SALARY_OPTIONS = [
  { value: "", label: "Mọi mức lương" },
  { value: "3000000", label: "Từ 3 triệu" },
  { value: "5000000", label: "Từ 5 triệu" },
  { value: "10000000", label: "Từ 10 triệu" },
  { value: "15000000", label: "Từ 15 triệu" },
  { value: "20000000", label: "Từ 20 triệu" },
];

/**
 * Filter bar. Keeps its own draft state and calls `onApply(values)` on submit
 * (selects apply immediately). Remount it with a new `key` to reset from the URL.
 */
export function JobFilters({ values, onApply }) {
  const [draft, setDraft] = useState(values);
  const { data: categories = [] } = useCategories();

  const set = (name) => (e) => setDraft((d) => ({ ...d, [name]: e.target.value }));
  const setAndApply = (name) => (e) => {
    const next = { ...draft, [name]: e.target.value };
    setDraft(next);
    onApply(next);
  };
  const hasFilters = Object.values(values).some(Boolean);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onApply(draft);
      }}
      className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm sm:p-5"
      role="search"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={draft.keyword}
            onChange={set("keyword")}
            placeholder="Chức danh hoặc tên công ty..."
            aria-label="Từ khóa"
            className="h-11 pl-9"
          />
        </div>
        <div className="relative sm:w-64">
          <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={draft.location}
            onChange={set("location")}
            placeholder="Địa điểm"
            aria-label="Địa điểm"
            className="h-11 pl-9"
          />
        </div>
        <Button type="submit" className="h-11 px-6">
          Tìm kiếm
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="filter-category" className="text-xs text-muted-foreground">Danh mục</Label>
          <select id="filter-category" className={SELECT_CLASS} value={draft.categoryId} onChange={setAndApply("categoryId")}>
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-type" className="text-xs text-muted-foreground">Loại hình</Label>
          <select id="filter-type" className={SELECT_CLASS} value={draft.jobType} onChange={setAndApply("jobType")}>
            <option value="">Tất cả loại hình</option>
            {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-salary" className="text-xs text-muted-foreground">Mức lương</Label>
          <select id="filter-salary" className={SELECT_CLASS} value={draft.salaryMin} onChange={setAndApply("salaryMin")}>
            {SALARY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          className="h-8 text-muted-foreground"
          onClick={() => onApply({ keyword: "", categoryId: "", jobType: "", location: "", salaryMin: "" })}
        >
          <X /> Xóa bộ lọc
        </Button>
      )}
    </form>
  );
}
