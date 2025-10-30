import { MonthDay } from "@/types";
import { isBefore, isSaturday, isSunday, startOfDay } from "date-fns";
import { Matcher } from "react-day-picker";

export interface CalendarModifiers {
  disabled: Matcher | Matcher[];
  working: Matcher | Matcher[];
  nonWorking: Matcher | Matcher[];
}

export const createCalendarModifiers = (
  monthDaysMap: Map<string, MonthDay>,
  today: Date = startOfDay(new Date()),
): Record<string, Matcher | Matcher[]> => {
  const getDayData = (date: Date): MonthDay | undefined => {
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return monthDaysMap.get(key);
  };

  // Return as Record<string, Matcher | Matcher[]> to match shadcn's expected type
  return {
    disabled: (date: Date) =>
      isBefore(date, today) || isSaturday(date) || isSunday(date),

    working: (date: Date) => {
      const dayData = getDayData(date);
      return dayData?.isWorkingDay ?? false;
    },

    nonWorking: (date: Date) => {
      const dayData = getDayData(date);
      return dayData ? !dayData.isWorkingDay : false;
    },
  };
};

export const calendarModifiersStyles = {
  disabled: {
    opacity: 0.3,
    pointerEvents: "none" as const,
  },
  working: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
  },
  nonWorking: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
};
