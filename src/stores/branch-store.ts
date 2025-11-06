"use client";

import { Branch } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BranchState {
  selectedBranch: Branch | undefined;
  setBranch: (branch: Branch | undefined) => void;
  resetBranch: () => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      selectedBranch: undefined,
      setBranch: (selectedBranch) => set({ selectedBranch }),
      resetBranch: () => set({ selectedBranch: undefined }),
    }),
    {
      name: "current-branch",
    },
  ),
);
