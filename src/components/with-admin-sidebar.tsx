import { Branch, Navigation } from "@/types";
import { LuSettings2 } from "react-icons/lu";
import AdminSidebar from "./admin-sidebar";

export const branchesDummy: Branch[] = [
  {
    id: "1",
    name: "Main Branch",
    branchCode: "MB001",
    address: "123 Main Street, Cebu City, Philippines",
  },
  {
    id: "2",
    name: "Consolation Branch",
    branchCode: "MD002",
    address: "456 Lopez Jaena Street, Mandaue City, Philippines",
  },
];

const navigations: Navigation[] = [
  {
    icon: LuSettings2,
    url: "/admin/appointments",
    name: "Appointments",
  },
];

export default function WithAdminSidebar() {
  return (
    <>
      <AdminSidebar branches={branchesDummy} navigations={navigations} />
    </>
  );
}
