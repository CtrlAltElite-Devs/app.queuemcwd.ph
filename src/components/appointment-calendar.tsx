"use client";

import { Calendar } from "@/components/ui/calendar";
import { useCalendarSelection } from "@/hooks/use-calendar-selection";
import { useDateToMonthDay, useMonthDaysMap } from "@/hooks/use-month-days";
import {
  calendarModifiersStyles,
  createCalendarModifiers,
} from "@/utils/calendar-modifiers";
import { startOfDay } from "date-fns";

interface AppointmentCalendarProps {
  onDateSelect?: (
    date: Date | undefined,
    monthDay: unknown | undefined,
  ) => void;
}

export default function AppointmentCalendar({
  onDateSelect,
}: AppointmentCalendarProps) {
  const today = startOfDay(new Date());

  const { monthDaysMap, isLoading, error } = useMonthDaysMap();
  const { getMonthDayFromDate } = useDateToMonthDay(monthDaysMap);
  const { selectedDate, selectedMonthDay, handleDateSelect } =
    useCalendarSelection(getMonthDayFromDate);

  const handleSelect = (date: Date | undefined) => {
    handleDateSelect(date);
    onDateSelect?.(date, selectedMonthDay);
  };

  const modifiers = createCalendarModifiers(monthDaysMap, today);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-600">Error loading calendar data</div>
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
          defaultMonth={today}
          numberOfMonths={1}
          showOutsideDays={false}
          className="w-full max-w-xs rounded-lg border p-4 text-base shadow-md sm:max-w-sm md:max-w-md md:text-lg"
          modifiers={modifiers}
          modifiersStyles={calendarModifiersStyles}
        />
      </div>
    </div>
  );
}
