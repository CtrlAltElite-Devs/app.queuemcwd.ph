"use client";

import BackgroundSlideShow from "@/components/background-slideshow";
import HubCard from "@/components/hub-card";
import MainLayout from "@/components/layouts/main-layout";
import { shimmerBranchTemplates } from "@/components/shimmer-templates";
import { AppShimmer } from "@/components/ui/app-shimmer";
import { cn } from "@/lib/utils";
import { useGetBranches } from "@/services/get-branches";
import { useBranchStore } from "@/stores/branch-store";
import { Branch } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ServiceHubGridProps = {
  branches: Branch[];
  isNavigating: boolean;
  onSelect: (branch: Branch) => void;
};

function ServiceHubGrid({
  branches,
  isNavigating,
  onSelect,
}: ServiceHubGridProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-wrap justify-center gap-4 px-4 transition-opacity duration-300",
        isNavigating && "pointer-events-none opacity-80",
      )}
    >
      {branches.map((branch) => (
        <HubCard key={branch.id} {...branch} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function SelectServiceHubPage() {
  const router = useRouter();
  const { data: branches = [], isLoading, isError } = useGetBranches();
  const { setBranch } = useBranchStore();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setBranch(undefined);
  }, [setBranch]);

  const handleSelect = (branch: Branch) => {
    setIsNavigating(true);
    setBranch(branch);
    router.push("/dashboard");
  };

  return (
    <>
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
              <span className="text-2xl font-semibold">
                MCWD Queueing System
              </span>
              <br />
              Get your appointments here now.
            </p>
          </div>

          {isError && (
            <p className="text-sm text-red-500">Failed to load branches.</p>
          )}

          {!isError && (
            <AppShimmer
              loading={isLoading}
              templateProps={{
                branches: shimmerBranchTemplates,
                isNavigating: false,
                onSelect: () => undefined,
              }}
            >
              <ServiceHubGrid
                branches={branches}
                isNavigating={isNavigating}
                onSelect={handleSelect}
              />
            </AppShimmer>
          )}
        </MainLayout>
      </BackgroundSlideShow>
    </>
  );
}
