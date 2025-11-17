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
    opacity: 0.25,
    pointerEvents: "none" as const,
    color: "#9ca3af", // Tailwind gray-400 text
    backgroundColor: "transparent",
    borderRadius: "0.375rem", // smooth corners
  },
  working: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    fontWeight: 500,
    borderRadius: "0.5rem",
    transition: "all 0.2s ease-in-out",
  },
  nonWorking: {
    backgroundColor: "rgba(239, 68, 68, 0.15)", // slightly stronger red
    color: "#b91c1c", // Tailwind red-700 text
    fontWeight: 500,
    borderRadius: "0.5rem",
    transition: "all 0.2s ease-in-out",
  },
  selected: {
    backgroundColor: "rgba(59, 130, 246, 0.3)", // Tailwind blue-500 with transparency
    color: "#1d4ed8", // Tailwind blue-700 text
    fontWeight: 600,
    borderRadius: "0.5rem",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
  },
  today: {
    border: "2px solid #3b82f6", // Tailwind blue-500
    borderRadius: "0.5rem",
    fontWeight: 600,
    color: "#1e40af", // Tailwind blue-800
  },
  hover: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
};

export const calendarModifiersClassNames = {
  disabled: "opacity-25 pointer-events-none text-gray-400 dark:text-gray-600",
  selected: "bg-primary text-white font-semibold rounded-lg dark:bg-blue-400",
  today:
    "border-2 border-blue-500 font-semibold rounded-lg dark:border-blue-400",
  working: "bg-working-day rounded-lg dark:text-black",
  nonWorking: "bg-non-working-day text-red-700 rounded-lg dark:text-red-400",
  hover:
    "cursor-pointer hover:bg-blue-500/10 dark:hover:bg-blue-400/20 transition-all",
  Chevron: "text-primary",
};
