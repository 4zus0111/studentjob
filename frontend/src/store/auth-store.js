import { create } from "zustand";

/**
 * Auth state lives in memory only (never localStorage / sessionStorage).
 * `isInitialized` turns true once the session restore attempt (POST /auth/refresh)
 * finished, so guards know whether "no user" really means "logged out".
 */
export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  isInitialized: false,

  setAuth: (accessToken, user) => set({ accessToken, user, isInitialized: true }),
  clearAuth: () => set({ accessToken: null, user: null, isInitialized: true }),
}));
