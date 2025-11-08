"use client";

import AdminLayout from "@/components/layouts/admin-layout";
import { useGetCurrentAdmin } from "@/services/get-current-admin";
import { useAdminStore } from "@/stores/admin-auth-store";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function AdminPageLayout({ children }: PropsWithChildren) {
  const { data: currentAdmin } = useGetCurrentAdmin();
  const { accessToken, setAdmin } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }

    if (currentAdmin) {
      setAdmin(currentAdmin);
    }

    console.log("current admin: ", JSON.stringify(currentAdmin, null, 2));
  }, [accessToken, router, currentAdmin, setAdmin]);

  return <AdminLayout>{children}</AdminLayout>;
}
