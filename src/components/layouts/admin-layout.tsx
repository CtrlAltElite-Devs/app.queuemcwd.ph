import { PropsWithChildren } from "react";
import WithAdminSidebar from "../with-admin-sidebar";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full font-sans dark:bg-black">
      <div className="flex min-h-screen">
        <WithAdminSidebar />
        <main className="flex flex-1 flex-col items-center justify-center gap-10">
          {children}
        </main>
      </div>
      {/* <WithFooter /> */}
    </div>
  );
}
