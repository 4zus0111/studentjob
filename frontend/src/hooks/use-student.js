"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as studentApi from "@/lib/api/student";

export function useStudentProfile() {
  return useQuery({ queryKey: ["student", "profile"], queryFn: studentApi.getStudentProfile });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentApi.updateStudentProfile,
    onSuccess: (profile) => queryClient.setQueryData(["student", "profile"], profile),
  });
}

export function useMyApplications(params) {
  return useQuery({
    queryKey: ["student", "applications", params],
    queryFn: () => studentApi.getMyApplications(params),
    placeholderData: keepPreviousData,
  });
}

/** `enabled` should be true only for logged-in students. */
export function useMyApplicationForJob(jobId, enabled) {
  return useQuery({
    queryKey: ["student", "application", String(jobId)],
    queryFn: () => studentApi.getMyApplicationForJob(jobId),
    enabled,
  });
}

export function useApply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentApi.applyToJob,
    // onSettled: a 409 ("already applied") also means our cached state was stale
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "applications"] });
      queryClient.invalidateQueries({ queryKey: ["student", "application"] });
    },
  });
}
