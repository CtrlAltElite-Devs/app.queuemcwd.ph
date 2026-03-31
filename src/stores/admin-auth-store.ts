import { Admin } from "@/types";
import { create } from "zustand";
import { cookieStorage } from "zustand-cookie-storage";
import { createJSONStorage, persist } from "zustand/middleware";

interface AdminAuthState {
  admin: Admin | undefined;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  setAccessToken: (token: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setAdmin: (admin: Admin) => void;
}

export const useAdminStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      setAccessToken: (token: string) => set({ accessToken: token }),
      setTokens: (accessToken: string, refreshToken: string) =>
        set({ accessToken, refreshToken }),
      clearAuth: () =>
        set({
          accessToken: undefined,
          refreshToken: undefined,
          admin: undefined,
        }),
      setAdmin: (admin: Admin) => set({ admin }),
    }),
    {
      name: "admin-auth-token",
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
