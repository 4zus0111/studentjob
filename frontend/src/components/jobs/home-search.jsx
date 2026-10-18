"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Hero search box: sends the keyword to /jobs?keyword=... */
export function HomeSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = keyword.trim();
        router.push(q ? `/jobs?keyword=${encodeURIComponent(q)}` : "/jobs");
      }}
      className="flex w-full max-w-xl flex-col gap-2 rounded-2xl border bg-card p-2 shadow-lg shadow-primary/5 sm:flex-row"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Nhập chức danh hoặc tên công ty..."
          aria-label="Từ khóa tìm việc"
          className="h-11 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
        />
      </div>
      <Button type="submit" className="h-11 px-6">
        Tìm việc
      </Button>
    </form>
  );
}
