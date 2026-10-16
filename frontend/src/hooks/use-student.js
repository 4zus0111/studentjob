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

export function useApply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentApi.applyToJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student", "applications"] }),
  });
}
