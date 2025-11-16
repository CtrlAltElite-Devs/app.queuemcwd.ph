import { cn } from "@/lib/utils";
import { useBranchStore } from "@/stores/branch-store";
import { RefreshCcwDot } from "lucide-react";
import { useRouter } from "next/navigation";
import NavBar from "./containers/navbar";
import SelectBranchFab from "./select-branch-fab";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function WithNavbar() {
  const router = useRouter();
  const title = "Metropolitan Cebu Water District";
  const { selectedBranch, resetBranch } = useBranchStore();

  const handleChangeBranch = () => {
    resetBranch();
    router.push("/select-service-hub");
  };

  const hasBranch = !!selectedBranch;

  return (
    <div className="sticky top-0 z-999 mb-6">
      <NavBar title={title}>
        {!hasBranch && <ModeToggle />}

        {hasBranch && (
          <div className="flex items-center gap-2">
            {/* Desktop: text button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleChangeBranch}
                  className={cn(
                    "hidden items-center gap-2 rounded-2xl border p-2 transition-all duration-200 md:flex",
                    "text-sm lg:text-base",
                    "dark:bg-background hover:border-primary hover:bg-background hover:scale-105 hover:cursor-pointer hover:shadow-md",
                  )}
                  aria-label={`Switch to ${selectedBranch.name}`}
                >
                  <RefreshCcwDot className="h-5 w-5 transition-colors duration-200" />
                  {selectedBranch.name}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Select another service hub</p>
              </TooltipContent>
            </Tooltip>

            <SelectBranchFab />

            <ModeToggle />
          </div>
        )}
      </NavBar>
    </div>
  );
}
