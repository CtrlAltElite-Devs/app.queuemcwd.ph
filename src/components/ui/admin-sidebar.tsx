"use client";

import { Branch, Navigation } from "@/types";

import { usePathname } from "next/navigation";
import { NavMain } from "../nav-main";
import { TeamSwitcher } from "../team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./sidebar";

interface AdminSidebarProp {
  branches: Branch[];
  navigations: Navigation[];
  props?: React.ComponentProps<typeof Sidebar>;
}

export default function AdminSidebar({
  branches,
  props,
  navigations,
}: AdminSidebarProp) {
  const pathname = usePathname();

  const enhancedNavigations = navigations.map((item) => ({
    ...item,
    isActive: pathname === item.url || pathname.startsWith(item.url + "/"),
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher branches={branches} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={enhancedNavigations} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
