import { Navigation } from "@/types";
import { LuSettings2 } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

export const navigations: Navigation[] = [
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
