"use client";

import AdminLayout from "@/components/layouts/admin-layout";
import { PropsWithChildren } from "react";

export default function AdminPageLayout({ children }: PropsWithChildren) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>;
    </>
  );
}
