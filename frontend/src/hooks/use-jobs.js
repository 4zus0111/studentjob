"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as jobsApi from "@/lib/api/jobs";

/** Removes empty values so they are not sent as `?keyword=`. */
export function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined),
  );
}

export function useJobs(params) {
  const cleaned = cleanParams(params);
  return useQuery({
    queryKey: ["jobs", cleaned],
    queryFn: () => jobsApi.searchJobs(cleaned),
    placeholderData: keepPreviousData,
  });
}

export function useJob(id) {
  return useQuery({
    queryKey: ["job", String(id)],
    queryFn: () => jobsApi.getJob(id),
    retry: false,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: jobsApi.getCategories,
    staleTime: 10 * 60_000,
  });
}
