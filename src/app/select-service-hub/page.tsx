"use client";

import HubCard from "@/components/hub-card";
import MainLayout from "@/components/layouts/main-layout";
import { useGetBranches } from "@/services/get-branches";
import { useBranchStore } from "@/stores/branch-store";
import { Branch } from "@/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SelectServiceHubPage() {
  const router = useRouter();
  const { data: branches = [], isLoading, isError } = useGetBranches();
  const { setBranch, selectedBranch } = useBranchStore();

  useEffect(() => {
    if (selectedBranch) router.push("/dashboard");
  }, [selectedBranch, router]);

  const handleSelect = (branch: Branch) => {
    setBranch(branch);
    router.push("/");
  };

  return (
    <MainLayout>
      <h1 className="text-lg font-semibold mb-4">Select Service Hub</h1>

      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {isError && (
        <p className="text-red-500 text-sm">Failed to load branches.</p>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-wrap justify-center gap-4 w-full">
          {branches.map((b: Branch) => (
            <HubCard key={b.id} {...b} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
