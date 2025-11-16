"use client";
import { useBranchStore } from "@/stores/branch-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const hasHydrated = useBranchStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return; // Wait until localStorage loads

    if (selectedBranch) {
      router.replace("/dashboard");
    } else {
      router.replace("/select-service-hub");
    }
  }, [selectedBranch, hasHydrated, router]);

  return null; // nothing to render
}
