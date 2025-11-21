import { MonthDay } from "@/types";
import { addDays, isWeekend, startOfDay } from "date-fns";

export const getNextWorkingDay = (monthDaysMap: Map<string, MonthDay>) => {
  let current = addDays(startOfDay(new Date()), 1);

  const getKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;

  // Keep looping until we find a working day
  while (true) {
    const key = getKey(current);
    const monthDay = monthDaysMap.get(key);

    if (!isWeekend(current) && monthDay?.isWorkingDay) {
      return current;
    }

    current = addDays(current, 1);
  }
};
