"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { refreshSession } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

/**
 * Restores the session once on app start: the access token only lives in memory,
 * so after a reload we ask the backend for a new one using the HttpOnly refresh cookie.
 */
function SessionRestorer() {
  useEffect(() => {
    // refreshSession() shares one in-flight promise, so StrictMode's double effect is harmless
    refreshSession().catch(() => {
      // No / expired cookie: simply not logged in
      useAuthStore.getState().clearAuth();
    });
  }, []);

  return null;
}

export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => error?.response?.status >= 500 && failureCount < 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionRestorer />
      {children}
    </QueryClientProvider>
  );
}
