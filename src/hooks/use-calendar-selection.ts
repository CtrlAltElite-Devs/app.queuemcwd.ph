import { MonthDay } from "@/types";
import { useCallback, useState } from "react";

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

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      setSelectedDate(date);

      if (date) {
        const monthDay = getMonthDayFromDate(date);
        setSelectedMonthDay(monthDay);
      } else {
        setSelectedMonthDay(undefined);
      }
    },
    [getMonthDayFromDate],
  );

  return {
    selectedDate,
    selectedMonthDay,
    handleDateSelect,
  };
};
