import { api } from "@/lib/axios";
import { Admin } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getAdmin = () =>
  api.get<Admin>(`/api/v1/admin/me`).then((res) => res.data);

export const useGetCurrentAdmin = () =>
  useQuery<Admin>({
    queryKey: ["current-admin"],
    queryFn: () => getAdmin(),
  });
