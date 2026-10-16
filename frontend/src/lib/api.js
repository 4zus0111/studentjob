import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

// Trailing slashes are stripped: "//auth/refresh" is rejected by Spring Security
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");

/** Single axios instance for the whole app. */
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send / receive the HttpOnly refresh cookie
  headers: { "Content-Type": "application/json" },
});

// Endpoints where a 401 must NOT trigger a token refresh (wrong password, no cookie, ...)
const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

function skipsRefresh(config) {
  const url = config?.url ?? "";
  return NO_REFRESH_PATHS.some((path) => url.startsWith(path));
}

// ---- Request: attach the access token ---------------------------------------
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Refresh -----------------------------------------------------------------
// A single in-flight promise is shared, so concurrent 401s trigger ONE refresh call
// and all queued requests are retried with the new token.
let refreshPromise = null;

/**
 * Calls POST /auth/refresh (cookie based) and stores the new access token + user.
 * Uses plain axios (not `api`) so the interceptors below can never loop.
 * Resolves with the new access token, rejects when the session cannot be restored.
 */
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, null, { withCredentials: true })
      .then((res) => {
        const { accessToken, user } = res.data.data;
        useAuthStore.getState().setAuth(accessToken, user);
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// ---- Response: on 401 refresh once, retry, else logout ----------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || !original || original._retry || skipsRefresh(original)) {
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      const token = await refreshSession();
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined" && !/^\/(login|register)/.test(window.location.pathname)) {
        window.location.assign("/login");
      }
      return Promise.reject(refreshError);
    }
  },
);
