import { MonthDay } from "@/types";
import { useState } from "react";

export interface CalendarSelection {
  selectedDate: Date | undefined;
  selectedMonthDay: MonthDay | undefined;
  handleDateSelect: (date: Date | undefined) => void;
}

export const useCalendarSelection = (
  getMonthDayFromDate: (date: Date) => MonthDay | undefined,
): CalendarSelection => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedMonthDay, setSelectedMonthDay] = useState<
    MonthDay | undefined
  >();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (date) {
      const monthDay = getMonthDayFromDate(date);
      setSelectedMonthDay(monthDay);
    } else {
      setSelectedMonthDay(undefined);
    }
  };

  return {
    selectedDate,
    selectedMonthDay,
    handleDateSelect,
  };
};
