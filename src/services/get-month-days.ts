import { api } from "@/lib/axios";
import { MonthDay } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getMonthDays = (month: number): Promise<MonthDay[]> =>
  api.get(`/api/v1/month-day?month=${month}`).then((res) => res.data);

export const useGetMonthDays = (month: number) =>
  useQuery({
    queryKey: ["month-days", month],
    queryFn: () => getMonthDays(month),
  });
