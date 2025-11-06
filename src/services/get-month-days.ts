import { api } from "@/lib/axios";
import { MonthDay } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getMonthDays = (
  month: number,
  branchId: string | undefined,
  year: number,
): Promise<MonthDay[]> =>
  api
    .get(`/api/v1/branch/${branchId}/month-days?month=${month}&year=${year}`)
    .then((res) => res.data);

export const useGetMonthDays = (
  month: number,
  branchId: string | undefined,
  year: number,
) =>
  useQuery({
    queryKey: ["month-days", month, branchId, year],
    queryFn: () => getMonthDays(month, branchId, year),
    enabled: !!branchId,
  });
