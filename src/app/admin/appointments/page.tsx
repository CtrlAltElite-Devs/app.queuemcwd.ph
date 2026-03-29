"use client";

import { AdminPageSkeleton } from "@/components/admin-page-skeleton";
import AppointmentSlotFields from "@/components/appointment-slot-fields";
import { McwdDatePicker } from "@/components/mcwd-date-picker";
import { useBranchStore } from "@/stores/branch-store";
import { MonthDay } from "@/types";
import { useState } from "react";

export default function AppointmentSettings() {
  const { selectedBranch } = useBranchStore();
  const [selectedMonthDay, setSelectedMonthDay] = useState<MonthDay>();

  const handleSelectDate = (
    date: Date | undefined,
    monthDay: MonthDay | undefined,
  ) => {
    setSelectedMonthDay(monthDay);
  };

  if (!selectedBranch) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6 px-4">
      <McwdDatePicker onDateSelect={handleSelectDate} />
      <AppointmentSlotFields monthDayId={selectedMonthDay?.id || ""} />
    </div>
  );
}
