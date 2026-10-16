"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as adminApi from "@/lib/api/admin";
import { cleanParams } from "@/hooks/use-jobs";

export function useAdminEmployers(params) {
  const cleaned = cleanParams(params);
  return useQuery({
    queryKey: ["admin", "employers", cleaned],
    queryFn: () => adminApi.getAdminEmployers(cleaned),
    placeholderData: keepPreviousData,
  });
}

export function useDecideEmployer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.decideEmployer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "employers"] }),
  });
}

export function useAdminJobs(params) {
  const cleaned = cleanParams(params);
  return useQuery({
    queryKey: ["admin", "jobs", cleaned],
    queryFn: () => adminApi.getAdminJobs(cleaned),
    placeholderData: keepPreviousData,
  });
}

export function useSetJobHidden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.setJobHidden,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["job"] }),
      ]),
  });
}

export function useAdminUsers(params) {
  const cleaned = cleanParams(params);
  return useQuery({
    queryKey: ["admin", "users", cleaned],
    queryFn: () => adminApi.getAdminUsers(cleaned),
    placeholderData: keepPreviousData,
  });
}

export function useSetUserLocked() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.setUserLocked,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "employers"] }),
      ]),
  });
}
