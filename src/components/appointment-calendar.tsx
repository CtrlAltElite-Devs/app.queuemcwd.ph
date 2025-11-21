"use client";

import { Calendar } from "@/components/ui/calendar";
import { useCalendarSelection } from "@/hooks/use-calendar-selection";
import { useDateToMonthDay, useMonthDaysMap } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { useBranchStore } from "@/stores/branch-store";
import { MonthDay } from "@/types";
import {
  calendarModifiersClassNames,
  createCalendarModifiers,
} from "@/utils/calendar-modifiers";
import { getNextWorkingDay } from "@/utils/next-working-day";
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
  const { selectedBranch } = useBranchStore();

  const { monthDaysMap, isLoading, error, refetch } = useMonthDaysMap(
    currentMonth.getMonth() + 1,
  );
  const { getMonthDayFromDate } = useDateToMonthDay(monthDaysMap);
  const { selectedDate, selectedMonthDay, handleDateSelect } =
    useCalendarSelection(getMonthDayFromDate);

  useEffect(() => {
    if (monthDaysMap.size === 0) return;

    const nextWorking = getNextWorkingDay(monthDaysMap);
    handleDateSelect(nextWorking);
  }, [monthDaysMap, handleDateSelect]);

  useEffect(() => {
    if (selectedDate) {
      onDateSelect?.(selectedDate, selectedMonthDay);
    }
  }, [selectedDate, getMonthDayFromDate, onDateSelect, selectedMonthDay]);

  const handleSelect = (date: Date | undefined) => {
    handleDateSelect(date);
    // onDateSelect?.(date, selectedMonthDay);
  };

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentMonth(date);
  }, []);

  const modifiers = createCalendarModifiers(
    monthDaysMap,
    today,
    selectedBranch?.allowedTimeFrame,
  );

  if (isLoading) {
    return (
      <div className="animate-pulse p-4">
        <div className="bg-background/20 border2 mx-auto w-full max-w-sm rounded-3xl p-4 shadow-xl [--cell-size:2.25rem] sm:max-w-md sm:[--cell-size:2.5rem] md:max-w-lg md:[--cell-size:3rem] lg:max-w-xl lg:[--cell-size:3.25rem]">
          {/* Placeholder for month header */}
          <div className="bg-background/40 mb-4 h-6 w-1/3 rounded" />

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1 gap-y-2">
            {Array.from({ length: 31 }).map((_, i) => (
              <div
                key={i}
                className="bg-background/40 h-(--cell-size) w-(--cell-size) rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-32 flex-col items-center justify-center space-y-2">
        <div className="text-lg text-[#B50505]">
          Error loading calendar data
        </div>
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
      <div
        className={cn(
          "transition-none duration-300",
          !selectedBranch && "pointer-events-none opacity-40",
        )}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          month={currentMonth}
          numberOfMonths={1}
          onMonthChange={handleMonthChange}
          showOutsideDays={false}
          className="dark:border-secondary dark:bg-card mx-auto w-full max-w-sm gap-x-1 gap-y-2 rounded-3xl border p-4 text-sm shadow-xl [--cell-size:2.25rem] sm:max-w-md sm:text-base sm:[--cell-size:2.5rem] md:mx-0 md:max-w-lg md:text-lg md:[--cell-size:3rem] lg:[--cell-size:3.25rem]"
          modifiers={modifiers}
          modifiersClassNames={calendarModifiersClassNames}
        />
      </div>
    </div>
  );
}
