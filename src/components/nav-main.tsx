"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconType } from "react-icons/lib";

export function NavMain({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon?: IconType;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={item.isActive}
              className={cn(
                "relative transition-all duration-200",
                item.isActive
                  ? "bg-sidebar-primary/10 text-sidebar-primary dark:bg-sidebar-primary/15 font-medium"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Link href={item.url} className="flex items-center gap-3">
                {item.isActive && (
                  <span className="bg-sidebar-primary absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full" />
                )}
                {item.icon && (
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      item.isActive && "text-sidebar-primary",
                    )}
                  />
                )}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
