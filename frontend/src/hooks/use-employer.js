"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as employerApi from "@/lib/api/employer";

export function useEmployerProfile() {
  return useQuery({ queryKey: ["employer", "profile"], queryFn: employerApi.getEmployerProfile });
}

export function useUpdateEmployerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employerApi.updateEmployerProfile,
    onSuccess: (profile) => queryClient.setQueryData(["employer", "profile"], profile),
  });
}

export function useMyJobs(params) {
  return useQuery({
    queryKey: ["employer", "jobs", params],
    queryFn: () => employerApi.getMyJobs(params),
    placeholderData: keepPreviousData,
  });
}

/** Public job lists / details change whenever the employer edits a job. */
function useInvalidateJobs() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] }),
      queryClient.invalidateQueries({ queryKey: ["jobs"] }),
      queryClient.invalidateQueries({ queryKey: ["job"] }),
    ]);
}

export function useCreateJob() {
  const invalidate = useInvalidateJobs();
  return useMutation({ mutationFn: employerApi.createJob, onSuccess: invalidate });
}

export function useUpdateJob() {
  const invalidate = useInvalidateJobs();
  return useMutation({ mutationFn: employerApi.updateJob, onSuccess: invalidate });
}

export function useDeleteJob() {
  const invalidate = useInvalidateJobs();
  return useMutation({ mutationFn: employerApi.deleteJob, onSuccess: invalidate });
}

export function useApplicants(jobId, params) {
  return useQuery({
    queryKey: ["employer", "applicants", String(jobId), params],
    queryFn: () => employerApi.getApplicants(jobId, params),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employerApi.updateApplicationStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employer", "applicants"] }),
  });
}
