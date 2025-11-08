import { useGetBranches } from "@/services/get-branches";
import { useBranchStore } from "@/stores/branch-store";
import { Navigation } from "@/types";
import { useEffect } from "react";
import { LuSettings2 } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import AdminSidebar from "./ui/admin-sidebar";

const navigations: Navigation[] = [
  {
    icon: LuSettings2,
    url: "/admin/appointments",
    name: "Appointments",
  },
  {
    icon: TbBrandGoogleAnalytics,
    url: "/admin/reports",
    name: "Reports",
  },
];

export default function WithAdminSidebar() {
  const { data: branches, isLoading } = useGetBranches();
  const { setBranch, selectedBranch } = useBranchStore();

  useEffect(() => {
    if (branches && branches.length && !selectedBranch) setBranch(branches[0]);
  }, [branches]);

  // Should do a full page load bai
  if (isLoading || !branches) {
    return <p>Fucking loading...</p>;
  }

  return (
    <>
      <AdminSidebar branches={branches} navigations={navigations} />
    </>
  );
}
