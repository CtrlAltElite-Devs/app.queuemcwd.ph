import { Navigation } from "@/types";
import { LuSettings2 } from "react-icons/lu";
import {
  TbBrandGoogleAnalytics,
  TbChartBar,
  TbListCheck,
} from "react-icons/tb";

export const navigations: Navigation[] = [
  {
    icon: TbListCheck,
    url: "/admin/queue",
    name: "Queue",
  },
  {
    icon: LuSettings2,
    url: "/admin/slot-management",
    name: "Slot Management",
  },
  {
    icon: TbChartBar,
    url: "/admin/analytics",
    name: "Analytics",
  },
  {
    icon: TbBrandGoogleAnalytics,
    url: "/admin/reports",
    name: "Reports",
  },
];
