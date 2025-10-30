"use client";

import AppointmentCalendar from "@/components/appointment-calendar";
import AppointmentSlots from "@/components/appointment-slots";
import MainLayout from "@/components/layouts/main-layout";
import { MonthDay } from "@/types";
import { useState } from "react";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedMonthDay, setSelectedMonthDay] = useState<
    MonthDay | undefined
  >();

  const handleDateSelect = (
    date: Date | undefined,
    monthDay: MonthDay | undefined,
  ) => {
    setSelectedDate(date);
    setSelectedMonthDay(monthDay);
  };

  return (
    <MainLayout>
      <AppointmentCalendar onDateSelect={handleDateSelect} />
      <AppointmentSlots monthDay={selectedMonthDay} />
    </MainLayout>
  );
}
