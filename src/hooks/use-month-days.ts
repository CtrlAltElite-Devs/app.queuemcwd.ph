import { useGetMonthDays } from "@/services/get-month-days";
import { MonthDay } from "@/types";
import { useMemo } from "react";

export const useMonthDaysMap = () => {
  const { data: monthDays, isLoading, error } = useGetMonthDays();

  const monthDaysMap = useMemo(() => {
    if (!monthDays) return new Map<string, MonthDay>();

    return new Map(
      monthDays.map((day) => [
        `${day.year}-${day.month.toString().padStart(2, "0")}-${day.day.toString().padStart(2, "0")}`,
        day,
      ]),
    );
  }, [monthDays]);

  return { monthDaysMap, isLoading, error, rawData: monthDays };
};

export const useDateToMonthDay = (monthDaysMap: Map<string, MonthDay>) => {
  const getMonthDayFromDate = (date: Date): MonthDay | undefined => {
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return monthDaysMap.get(key);
  };

  return { getMonthDayFromDate };
};
