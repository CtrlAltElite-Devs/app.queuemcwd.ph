"use client";

import { cn } from "@/lib/utils";
import { useBranchStore } from "@/stores/branch-store";
import { RefreshCcwDot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (media.matches) setMatches(true);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default function SelectBranchFab() {
  const router = useRouter();
  const { selectedBranch, resetBranch } = useBranchStore();
  const hasBranch = !!selectedBranch;

  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [manualInteraction, setManualInteraction] = useState(false);

  const handleChangeBranch = () => {
    resetBranch();
    router.push("/select-service-hub");
  };

  useEffect(() => {
    if (!hasBranch || !isSmallScreen) return;

    const initialTimeout = setTimeout(() => {
      if (!manualInteraction) setTooltipOpen(true);
    }, 1000);

    const interval = setInterval(() => {
      if (!manualInteraction) {
        setTooltipOpen(true);
        setTimeout(() => setTooltipOpen(false), 2000);
      }
    }, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [hasBranch, isSmallScreen, manualInteraction]);

  if (!hasBranch || !isSmallScreen) return null;

  return (
    <Tooltip
      open={tooltipOpen}
      onOpenChange={(open) => {
        setTooltipOpen(open);
        if (open) setManualInteraction(true);
      }}
      delayDuration={200}
    >
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={handleChangeBranch}
          className={cn(
            "fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-2xl border p-3 text-white transition-all duration-200",
            "text-sm lg:text-base",
            "dark:bg-primary hover:border-primary hover:bg-background bg-primary hover:scale-105 hover:cursor-pointer hover:shadow-md",
          )}
          aria-label={`Switch to ${selectedBranch.name}`}
        >
          <RefreshCcwDot className="h-5 w-5 transition-colors duration-200" />
          {selectedBranch.name}
        </Button>
      </TooltipTrigger>

      <TooltipContent side="top">
        <p>Select another service hub</p>
      </TooltipContent>
    </Tooltip>
  );
}
