"use client";

import HubCard from "@/components/hub-card";
import MainLayout from "@/components/layouts/main-layout";
import { useGetBranches } from "@/services/get-branches";
import { useBranchStore } from "@/stores/branch-store";
import { Branch } from "@/types";
import { Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const backgrounds = [
  "/images/main_office.png",
  "/images/sm_consolacion_hub.jpg",
];

export default function SelectServiceHubPage() {
  const router = useRouter();
  const { data: branches = [], isLoading, isError } = useGetBranches();
  const { setBranch, selectedBranch } = useBranchStore();
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    if (selectedBranch) router.push("/dashboard");
  }, [selectedBranch, router]);

  // Rotate background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (branch: Branch) => {
    setBranch(branch);
    router.push("/");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {backgrounds.map((src, index) => (
        <div
          key={src}
          className={`duration-2000ms absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity ease-in-out ${bgIndex === index ? "opacity-100" : "opacity-0"} `}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}

      <div className="absolute inset-0 z-10 bg-black/80" />

      <div className="relative z-20">
        <MainLayout>
          <div className="flex flex-col items-center justify-center gap-6 py-10">
            <Building2 className="text-primary size-8" />
            <h1 className="text-lg font-semibold text-white">
              Select Service Hub
            </h1>
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
      </div>
    </div>
  );
}
