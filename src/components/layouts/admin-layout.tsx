import { Separator } from "@radix-ui/react-separator";
import { PropsWithChildren } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import WithAdminSidebar from "../with-admin-sidebar";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full font-sans dark:bg-black">
      <div className="flex min-h-screen">
        <WithAdminSidebar />
        <div className="flex flex-1 flex-col gap-10">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    {/* Pwede e dynamic dire */}
                    <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Appointments</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main className="px-4">{children}</main>
        </div>
      </div>
      {/* <WithFooter /> */}
    </div>
  );
}
