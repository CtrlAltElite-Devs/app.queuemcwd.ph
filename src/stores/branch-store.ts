"use client";

import { Branch } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BranchState {
  selectedBranch: Branch | undefined;
  setBranch: (branch: Branch | undefined) => void;
  resetBranch: () => void;

  // hydration
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      selectedBranch: undefined,
      setBranch: (selectedBranch) => set({ selectedBranch }),
      resetBranch: () => set({ selectedBranch: undefined }),

      // hydration flags
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "current-branch",

      // called AFTER Zustand loads localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
