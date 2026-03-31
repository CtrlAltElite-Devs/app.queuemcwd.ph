"use client";

import { AppShimmer } from "@/components/ui/app-shimmer";
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
  allowToday?: boolean;
}

export default function AppointmentCalendar({
  onDateSelect,
  allowToday = false,
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

    const nextWorking = getNextWorkingDay(monthDaysMap, allowToday);
    if (nextWorking) {
      handleDateSelect(nextWorking);
      return;
    }

    // No selectable working day in current month (e.g. last day of month)
    // Auto-advance to next month only once from today's month
    const now = startOfDay(new Date());
    if (
      currentMonth.getMonth() === now.getMonth() &&
      currentMonth.getFullYear() === now.getFullYear()
    ) {
      setCurrentMonth(new Date(now.getFullYear(), now.getMonth() + 1, 1));
    }
  }, [monthDaysMap, handleDateSelect, allowToday, currentMonth]);

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
    allowToday,
  );

  if (error && !isLoading) {
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
        <AppShimmer loading={isLoading}>
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
        </AppShimmer>
      </div>
    </div>
  );
}
