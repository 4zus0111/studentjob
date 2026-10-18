"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as authApi from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ accessToken, user }) => setAuth(accessToken, user),
  });
}

export function useRegisterStudent() {
  return useMutation({ mutationFn: authApi.registerStudent });
}

export function useRegisterEmployer() {
  return useMutation({ mutationFn: authApi.registerEmployer });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: authApi.logout,
    // Clear the local session even if the request failed (e.g. server is down)
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.replace("/");
      toast.success("Đã đăng xuất");
    },
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: authApi.changePassword });
}
