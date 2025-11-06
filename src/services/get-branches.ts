import { api } from "@/lib/axios";
import { Branch } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getBranches = () =>
  api.get<Branch[]>(`/api/v1/branch`).then((res) => res.data);

export const useGetBranches = () =>
  useQuery<Branch[]>({
    queryKey: ["branches"],
    queryFn: () => getBranches(),
  });
