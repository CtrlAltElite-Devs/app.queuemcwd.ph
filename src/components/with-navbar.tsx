import { useBranchStore } from "@/stores/branch-store";
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

  return (
    <div className="sticky top-0 z-50">
      <NavBar title={title} />
      <div className="absolute top-1/2 right-4 flex -translate-y-1/2 transform items-center gap-2">
        {selectedBranch && (
          <Button
            className="cursor-pointer"
            variant={"outline"}
            onClick={handleChangeBranch}
          >
            Change Branch
          </Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
