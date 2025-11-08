import { useBranchStore } from "@/stores/branch-store";
import { Building } from "lucide-react";
import { useRouter } from "next/navigation";
import NavBar from "./containers/navbar";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";

export default function WithNavbar() {
  const router = useRouter();
  const title = "Metropolitan Cebu Water District";
  const { selectedBranch, resetBranch } = useBranchStore();

  const handleChangeBranch = () => {
    resetBranch();
    router.push("/select-branch");
  };

  const hasBranch = !!selectedBranch;

  return (
    <div className="sticky top-0 z-50">
      <NavBar title={title} />

      <div className="absolute top-1/2 right-4 flex -translate-y-1/2 transform items-center">
        {!hasBranch && <ModeToggle />}

        {/* Branch selected */}
        {hasBranch && (
          <div className="flex items-center gap-2">
            {/* Desktop: text button */}
            <Button
              variant="outline"
              onClick={handleChangeBranch}
              className="hidden h-9 sm:flex"
            >
              Change Branch
            </Button>

            <Button
              variant="outline"
              onClick={handleChangeBranch}
              className="flex h-9 w-9 items-center justify-center sm:hidden"
            >
              <Building className="h-5 w-5" />
            </Button>

            <ModeToggle />
          </div>
        )}
      </div>
    </div>
  );
}
