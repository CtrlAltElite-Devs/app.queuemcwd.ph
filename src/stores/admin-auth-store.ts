import { Admin } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthState {
  admin: Admin | undefined;
  accessToken: string | undefined;
  setAccessToken: (token: string) => void;
  setAdmin: (admin: Admin) => void;
}

export const useAdminStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: undefined,
      accessToken: undefined,
      setAccessToken: (token: string) => set({ accessToken: token }),
      setAdmin: (admin: Admin) => set({ admin }),
    }),
    {
      name: "admin-auth-token",
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
