"use client";

import { Branch, Navigation } from "@/types";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavMain } from "../nav-main";
import { TeamSwitcher } from "../team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
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
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={enhancedNavigations} />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-2 px-1 py-1 group-data-[collapsible=icon]:justify-center">
          <Image
            src="/images/mcwd_logo.png"
            alt="MCWD"
            width={24}
            height={24}
            className="shrink-0 opacity-60"
          />
          <span className="text-sidebar-foreground/50 truncate text-[10px] leading-tight group-data-[collapsible=icon]:hidden">
            MCWD Queue
            <br />
            Management
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
