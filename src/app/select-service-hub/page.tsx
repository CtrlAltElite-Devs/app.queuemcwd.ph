"use client";

import BackgroundSlideShow from "@/components/background-slideshow";
import HubCard from "@/components/hub-card";
import MainLayout from "@/components/layouts/main-layout";
import { useGetBranches } from "@/services/get-branches";
import { useBranchStore } from "@/stores/branch-store";
import { Branch } from "@/types";
import { Loader2 } from "lucide-react";
import Image from "next/image";
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
    <BackgroundSlideShow>
      <MainLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          {/* Logo */}
          <Image
            src="/images/mcwd_logo.png"
            alt="official_logo"
            width={60}
            height={60}
            className="mb-2"
          />

          {/* Welcome message */}
          <p className="text-md">
            <span className="text-2xl font-semibold">MCWD Queueing System</span>
            <br />
            Get your appointments here now.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-red-500">Failed to load branches.</p>
        )}

        {!isLoading && !isError && (
          <div className="flex w-full flex-wrap justify-center gap-4 px-4">
            {branches.map((b: Branch) => (
              <HubCard key={b.id} {...b} onSelect={handleSelect} />
            ))}
          </div>
        )}
      </MainLayout>
    </BackgroundSlideShow>
  );
}
