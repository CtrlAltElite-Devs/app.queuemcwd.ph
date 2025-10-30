import { api } from "@/lib/axios";
import { MonthDay } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getMonthDays = (): Promise<MonthDay[]> =>
  api.get("/api/v1/month-day").then((res) => res.data);

const QUERY_KEY = ["month-days", new Date().getMonth() + 1];

export const useGetMonthDays = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getMonthDays(),
  });
