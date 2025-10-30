"use client";

import { Calendar } from "@/components/ui/calendar";
import { useGetMonthDays } from "@/services/get-month-days";
import { MonthDay } from "@/types";

import { isBefore, isSaturday, isSunday, startOfDay } from "date-fns";
import * as React from "react";

export default function Calendar05() {
  const today = startOfDay(new Date());

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedMonthDay, setSelectedMonthDay] = React.useState<
    MonthDay | undefined
  >();
  const { data: monthDays, isLoading } = useGetMonthDays();

  // console.log("monthDays", JSON.stringify(monthDays, null, 2));
  console.log("selectedDate", selectedMonthDay);

  const monthDaysMap = React.useMemo(() => {
    if (!monthDays) return new Map();
    return new Map(
      monthDays.map((day) => [
        `${day.year}-${day.month.toString().padStart(2, "0")}-${day.day.toString().padStart(2, "0")}`,
        day,
      ]),
    );
  }, [monthDays]);

  // Function to get MonthDay from Date
  const getMonthDayFromDate = (date: Date): MonthDay | undefined => {
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return monthDaysMap.get(key);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (date) {
      const monthDay = getMonthDayFromDate(date);
      setSelectedMonthDay(monthDay);
      console.log("selectedMonthDay", monthDay);
    } else {
      setSelectedMonthDay(undefined);
    }
  };

  const isWorkingDay = (date: Date) => {
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const dayData = monthDaysMap.get(key);
    return dayData?.isWorkingDay ?? false;
  };

  const isNonWorkingDay = (date: Date) => {
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const dayData = monthDaysMap.get(key);
    return dayData && !dayData.isWorkingDay;
  };

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="transition-transform duration-200">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        defaultMonth={today}
        numberOfMonths={1}
        showOutsideDays={false}
        className="w-full max-w-xs rounded-lg border p-4 text-base shadow-md sm:max-w-sm md:max-w-md md:text-lg"
        modifiers={{
          disabled: (date) =>
            isBefore(date, today) || isSaturday(date) || isSunday(date),
          working: isWorkingDay,
          nonWorking: isNonWorkingDay,
        }}
        modifiersStyles={{
          disabled: {
            opacity: 0.3,
            pointerEvents: "none",
          },
          working: {
            backgroundColor: "rgba(34, 197, 94, 0.1)",
          },
          nonWorking: {
            backgroundColor: "rgba(239, 68, 68, 0.1)",
          },
        }}
        // Remove the custom Day component to avoid type issues
      />
    </div>
  );
}
