import { useGetMonthDays } from "@/services/get-month-days";
import { useBranchStore } from "@/stores/branch-store";
import { MonthDay } from "@/types";
import { useCallback, useMemo } from "react";

export const useMonthDaysMap = (monthNumber: number) => {
  const { selectedBranch } = useBranchStore();
  const currentYear = new Date().getFullYear();

  const {
    data: monthDays,
    isLoading,
    error,
    refetch,
  } = useGetMonthDays(monthNumber, selectedBranch?.id, currentYear);

  // console.log("month days data", monthDays);

  const monthDaysMap = useMemo(() => {
    if (!monthDays) return new Map<string, MonthDay>();

    return new Map(
      monthDays.map((day) => {
        const monthDay: MonthDay = {
          id: day.id,
          createdAt: day.createdAt || new Date(),
          updatedAt: day.updatedAt || new Date(),
          year: currentYear,
          month: day.month,
          day: day.day,
          dayOfWeek: day.dayOfWeek,
          isWorkingDay: day.isWorkingDay,
        };

        const key = `${currentYear}-${day.month.toString().padStart(2, "0")}-${day.day.toString().padStart(2, "0")}`;

        return [key, monthDay];
      }),
    );
  }, [monthDays]);

  return { monthDaysMap, isLoading, error, rawData: monthDays, refetch };
};

export const useDateToMonthDay = (monthDaysMap: Map<string, MonthDay>) => {
  const getMonthDayFromDate = useCallback(
    (date: Date): MonthDay | undefined => {
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      return monthDaysMap.get(key);
    },
    [monthDaysMap],
  );

  return { getMonthDayFromDate };
};
