"use client";

import AppointmentCalendar from "@/components/appointment-calendar";
import AppointmentSlots from "@/components/appointment-slots";
import MainLayout from "@/components/layouts/main-layout";
import { MonthDay } from "@/types";
import { useCallback, useState } from "react";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedMonthDay, setSelectedMonthDay] = useState<
    MonthDay | undefined
  >();

  // console.log("selected: date ", selectedDate);
  // console.log("selected month day ", selectedMonthDay);

  const handleDateSelect = useCallback(
    (date: Date | undefined, monthDay: MonthDay | undefined) => {
      setSelectedDate(date);
      setSelectedMonthDay(monthDay);
    },
    [],
  );

  return (
    <MainLayout>
      <AppointmentCalendar onDateSelect={handleDateSelect} />
      <AppointmentSlots monthDay={selectedMonthDay} />
    </MainLayout>
  );
}
