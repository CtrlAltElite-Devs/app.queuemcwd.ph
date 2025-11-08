"use client";

import AppointmentCalendar from "@/components/appointment-calendar";
import AppointmentSlots from "@/components/appointment-slots";
import MainLayout from "@/components/layouts/main-layout";
import { useBranchStore } from "@/stores/branch-store";
import { MonthDay } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { selectedBranch } = useBranchStore();
  const [selectedMonthDay, setSelectedMonthDay] = useState<
    MonthDay | undefined
  >();

  const handleDateSelect = useCallback(
    (date: Date | undefined, monthDay: MonthDay | undefined) => {
      setSelectedDate(date);
      setSelectedMonthDay(monthDay);
    },
    [],
  );

  useEffect(() => {
    if (!selectedBranch) router.push("/select-branch");
  }, [selectedBranch, router]);

  return (
    <MainLayout>
      <div className="flex w-full max-w-6xl flex-col gap-6 px-4 md:flex-row">
        {/* Calendar Section */}
        <div className="flex-1">
          <AppointmentCalendar onDateSelect={handleDateSelect} />
        </div>

        {/* Slots Section */}
        <div className="flex-1 space-y-4">
          <AppointmentSlots monthDay={selectedMonthDay} />
        </div>
      </div>
    </MainLayout>
  );
}
