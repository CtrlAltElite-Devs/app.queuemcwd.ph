"use client";

import { Check, ChevronsUpDown, MapPin } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useBranchStore } from "@/stores/branch-store";
import { Branch } from "@/types";
import { useEffect, useState } from "react";

type BranchExtended = Branch & {
  logo?: React.ElementType;
  plan?: string;
};

export function TeamSwitcher({ branches }: { branches: BranchExtended[] }) {
  const { isMobile } = useSidebar();
  const { setBranch, selectedBranch } = useBranchStore();
  const [activeTeam, setActiveTeam] = useState<BranchExtended | undefined>(
    selectedBranch,
  );

  useEffect(() => {
    if (activeTeam) setBranch(activeTeam);
  }, [activeTeam]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xs font-bold">
                {activeTeam.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="text-sidebar-foreground/60 truncate text-xs">
                  Service Hub
                </span>
              </div>
              <ChevronsUpDown className="text-sidebar-foreground/50 ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Branches
            </DropdownMenuLabel>
            {branches.map((team, index) => {
              const isActive = team.id === activeTeam.id;
              return (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className={cn(
                    "gap-2 p-2",
                    isActive && "bg-accent font-medium",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md border text-xs",
                      isActive
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    <MapPin className="size-3.5" />
                  </div>
                  <span className="flex-1">{team.name}</span>
                  {isActive && (
                    <Check className="text-primary ml-auto size-4" />
                  )}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
