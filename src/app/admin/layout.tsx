"use client";

import AdminLayout from "@/components/layouts/admin-layout";
import { useGetCurrentAdmin } from "@/services/get-current-admin";
import { useAdminStore } from "@/stores/admin-auth-store";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

// TODO: Refactor admin token to store using cookie and remove it from store and use setCookie helper in token storage
export default function AdminPageLayout({ children }: PropsWithChildren) {
  const { data: currentAdmin } = useGetCurrentAdmin();
  const { accessToken, setAdmin } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    if (currentAdmin && accessToken) {
      setAdmin(currentAdmin);
    }
  }, [accessToken, router, currentAdmin, setAdmin]);

  return <AdminLayout>{children}</AdminLayout>;
}
