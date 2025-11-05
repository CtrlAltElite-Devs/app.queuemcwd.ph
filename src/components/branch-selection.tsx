import { cn } from "@/lib/utils";
import { PiBuildingOffice } from "react-icons/pi";
import { Button } from "./ui/button";

interface BranchSelectionProps {
  branches: string[];
  selectedBranch?: string;
  onBranchSelect: (branch: string) => void;
}

export default function BranchSelection({
  branches,
  selectedBranch,
  onBranchSelect,
}: BranchSelectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <PiBuildingOffice size={20} />
        <h3 className="text-md font-semibold text-gray-700">Select Branch</h3>
      </div>
      <div className="flex gap-4">
        {branches.map((branch) => (
          <Button
            key={branch}
            variant="outline"
            onClick={() => onBranchSelect(branch)}
            size="lg"
            className={cn(
              "flex-1 rounded-lg border-gray-300 bg-white text-left text-gray-700",
              selectedBranch === branch
                ? "!bg-primary !text-white"
                : "hover:border-primary hover:bg-gray-50",
            )}
          >
            {branch}
          </Button>
        ))}
      </div>
    </div>
  );
}
