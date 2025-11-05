"use client";

import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalendarSelection } from "@/hooks/use-calendar-selection";
import { useDateToMonthDay, useMonthDaysMap } from "@/hooks/use-month-days";
import { MonthDay } from "@/types";
import {
  calendarModifiersStyles,
  createCalendarModifiers,
} from "@/utils/calendar-modifiers";
import { startOfDay } from "date-fns";
import { useCallback, useEffect, useState } from "react";

interface AppointmentCalendarProps {
  onDateSelect?: (
    date: Date | undefined,
    monthDay: MonthDay | undefined,
  ) => void;
}

export default function AppointmentCalendar({
  onDateSelect,
}: AppointmentCalendarProps) {
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  const { monthDaysMap, isLoading, error, refetch } = useMonthDaysMap(
    currentMonth.getMonth() + 1,
  );
  const { getMonthDayFromDate } = useDateToMonthDay(monthDaysMap);
  const { selectedDate, selectedMonthDay, handleDateSelect } =
    useCalendarSelection(getMonthDayFromDate);

  useEffect(() => {
    if (selectedDate) {
      onDateSelect?.(selectedDate, selectedMonthDay);
    }
  }, [selectedDate, getMonthDayFromDate, onDateSelect, selectedMonthDay]);

  const handleSelect = (date: Date | undefined) => {
    handleDateSelect(date);
    // onDateSelect?.(date, selectedMonthDay);
    console.log("handleSelect date", date);
  };

  const handleMonthChange = useCallback((date: Date) => {
    console.log("📅 Month changed to:", date);
    setCurrentMonth(date);
  }, []);

  const modifiers = createCalendarModifiers(monthDaysMap, today);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {/* Weekday headers placeholder */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {["S", "M", "T", "W", "TH", "F", "SUN"].map((day) => (
            <Skeleton
              key={day}
              className="h-5 w-full rounded-md bg-gray-200 sm:h-6 md:h-7"
            />
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 justify-items-center gap-2">
          {Array.from({ length: 42 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[2.75rem] w-[2.75rem] rounded-md bg-gray-200 sm:h-[3rem] sm:w-[3rem] md:h-[3.25rem] md:w-[3.25rem] lg:mx-2"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-32 flex-col items-center justify-center space-y-2">
        <div className="text-lg text-red-600">Error loading calendar data</div>
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="transition-transform duration-200">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          month={currentMonth} // use controlled month to avoid reset
          numberOfMonths={1}
          onMonthChange={handleMonthChange}
          showOutsideDays={false}
          className="w-full max-w-md gap-x-1 gap-y-2 rounded-3xl border p-4 text-lg shadow-lg [--cell-size:2.75rem] sm:gap-x-2 md:gap-x-3 md:text-xl md:[--cell-size:3rem]"
          modifiers={modifiers}
          modifiersStyles={calendarModifiersStyles}
        />
      </div>
    </div>
  );
}
