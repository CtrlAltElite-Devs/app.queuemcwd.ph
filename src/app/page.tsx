"use client";

import AppointmentCalendar from "@/components/appointment-calendar";
import AppointmentSlots from "@/components/appointment-slots";
import MainLayout from "@/components/layouts/main-layout";
import WithBranches from "@/components/with-branch";
import { branches } from "@/constants/branch";
import { MonthDay } from "@/types";
import { useCallback, useState } from "react";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedMonthDay, setSelectedMonthDay] = useState<
    MonthDay | undefined
  >();
  const [selectedBranch, setSelectedBranch] = useState<string | undefined>();

  const handleDateSelect = useCallback(
    (date: Date | undefined, monthDay: MonthDay | undefined) => {
      setSelectedDate(date);
      setSelectedMonthDay(monthDay);
    },
    [],
  );

  const handleBranchChange = useCallback((branch: string) => {
    setSelectedBranch(branch);
    // Pwede e reset ang slots when branch changes
  }, []);

  return (
    <MainLayout>
      <AppointmentCalendar onDateSelect={handleDateSelect} />
      <div className="space-y-4">
        <WithBranches
          onBranchChange={handleBranchChange}
          initialBranch={branches[0]}
        />
        <AppointmentSlots monthDay={selectedMonthDay} branch={selectedBranch} />
      </div>
    </MainLayout>
  );
}
