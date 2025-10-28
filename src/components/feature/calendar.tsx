"use client";

import { Calendar } from "@/components/ui/calendar";
import { isBefore, isSaturday, isSunday, startOfDay } from "date-fns";
import * as React from "react";

export default function Calendar05() {
  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  return (
    <div className="flex justify-center p-4 md:p-6">
      <div className="mt-12 mr-10 scale-[1.3] transition-transform duration-200 sm:ml-10 sm:scale-[1.1] md:scale-[1.4] lg:ml-20 lg:scale-[1.5]">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          defaultMonth={today}
          numberOfMonths={1}
          showOutsideDays={false}
          className="w-full max-w-xs rounded-lg border p-4 text-base shadow-md sm:max-w-sm md:max-w-md md:text-lg"
          modifiers={{
            disabled: (date) =>
              isBefore(date, today) || isSaturday(date) || isSunday(date),
          }}
          modifiersStyles={{
            disabled: {
              opacity: 0.3,
              pointerEvents: "none",
            },
          }}
        />
      </div>
    </div>
  );
}
