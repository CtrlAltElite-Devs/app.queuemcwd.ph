import { navigations } from "@/constants/navigations";
import { useGetBranches } from "@/services/get-branches";
import { useBranchStore } from "@/stores/branch-store";
import { useEffect } from "react";
import AdminSidebar from "./ui/admin-sidebar";

export default function WithAdminSidebar() {
  const { data: branches, isLoading } = useGetBranches();
  const { setBranch, selectedBranch } = useBranchStore();

  useEffect(() => {
    if (branches && branches.length && !selectedBranch) setBranch(branches[0]);
  }, [branches, selectedBranch, setBranch]);

  // Should do a full page load bai
  if (isLoading || !branches) {
    return <p>Loading branch...</p>;
  }

  return (
    <>
      <AdminSidebar branches={branches || []} navigations={navigations} />
    </>
  );
}
