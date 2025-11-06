"use client";

import MainLayout from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetBranches } from "@/services/get-branches";
import { useBranchStore } from "@/stores/branch-store";
import { Branch } from "@/types";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SelectBranchPage() {
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
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">Select a Branch</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {isLoading && (
            <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Fetching branches...</span>
            </div>
          )}

          {isError && (
            <p className="text-center text-sm text-red-500">
              Failed to load branches.
            </p>
          )}

          {!isLoading &&
            !isError &&
            branches.map((b) => (
              <Button
                key={b.id}
                variant="outline"
                onClick={() => handleSelect(b)}
                className="w-full cursor-pointer"
              >
                {b.name}
              </Button>
            ))}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
