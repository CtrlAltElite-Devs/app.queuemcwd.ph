import { useState } from "react";
import BranchSelection from "./branch-selection";
import { branches } from "@/constants/branch";

interface WithBranchProps {
  onBranchChange?: (branch: string) => void;
  initialBranch?: string;
}

export default function WithBranch({
  onBranchChange,
  initialBranch,
}: WithBranchProps) {
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>(
    initialBranch,
  );

  const handleBranchSelect = (branch: string) => {
    setSelectedBranch(branch);
    onBranchChange?.(branch);
  };

  return (
    <>
      <BranchSelection
        branches={branches}
        selectedBranch={selectedBranch}
        onBranchSelect={handleBranchSelect}
      />
    </>
  );
}
