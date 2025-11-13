"use client";

import AppointmentSlotFields from "@/components/appointment-slot-fields";
import { McwdDatePicker } from "@/components/mcwd-date-picker";
import { MonthDay } from "@/types";
import { useState } from "react";

// TODO: should have store for current working day

export default function AppointmentSettings() {
  const [selectedMonthDay, setSelectedMonthDay] = useState<MonthDay>();

  const handleSelectDate = (
    date: Date | undefined,
    monthDay: MonthDay | undefined,
  ) => {
    setSelectedMonthDay(monthDay);
  };

  return (
    <div className="space-y-6 px-4">
      <McwdDatePicker onDateSelect={handleSelectDate} />
      <AppointmentSlotFields monthDayId={selectedMonthDay?.id || ""} />
    </div>
  );
}
