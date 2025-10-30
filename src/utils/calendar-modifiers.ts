import { MonthDay } from "@/types";
import {
  addDays,
  isBefore,
  isSameDay,
  isSaturday,
  isSunday,
  startOfDay,
} from "date-fns";
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
    const key = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return monthDaysMap.get(key);
  };

  // --- Compute next 7 weekdays from today (skipping weekends)
  const allowedWeekdays: Date[] = [];
  let current = startOfDay(today);
  while (allowedWeekdays.length < 7) {
    if (!isSaturday(current) && !isSunday(current)) {
      allowedWeekdays.push(current);
    }
    current = addDays(current, 1);
  }

  // --- Define the modifiers
  return {
    disabled: (date: Date) =>
      // disable if before today
      isBefore(date, today) ||
      // disable weekends
      isSaturday(date) ||
      isSunday(date) ||
      // disable if not one of the allowed next 7 weekdays
      !allowedWeekdays.some((d) => isSameDay(d, date)),

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
