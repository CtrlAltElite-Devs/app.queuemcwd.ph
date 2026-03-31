"use client";

import { generateBreadcrumbs } from "@/utils";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { ModeToggle } from "../ui/mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import WithAdminSidebar from "../with-admin-sidebar";

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <div className="w-full font-sans dark:bg-background">
      <div className="flex min-h-screen">
        <WithAdminSidebar />
        <div className="flex flex-1 flex-col gap-10">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                      <div key={breadcrumb.href} className="flex items-center">
                        <BreadcrumbItem
                          className={index > 0 ? "hidden md:block" : ""}
                        >
                          {isLast ? (
                            <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={breadcrumb.href}>
                              {breadcrumb.name}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                      </div>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ModeToggle />
          </header>
          <main className="page-fade px-4 pb-6">{children}</main>
        </div>
      </div>
      {/* <WithFooter /> */}
    </div>
  );
}
