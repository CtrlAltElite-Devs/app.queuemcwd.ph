import { MonthDay } from "@/types";
import { isWeekend } from "date-fns";

const getKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

export const getNextWorkingDay = (monthDaysMap: Map<string, MonthDay>) => {
  const sortedDates = [...monthDaysMap.keys()].sort();
  const todayKey = getKey(new Date());

  for (const dateKey of sortedDates) {
    if (dateKey <= todayKey) continue;

    const date = new Date(dateKey);
    const monthDay = monthDaysMap.get(dateKey);

    if (!isWeekend(date) && monthDay?.isWorkingDay) return date;
  }

  return null;
};
