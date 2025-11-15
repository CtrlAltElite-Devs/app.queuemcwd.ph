"use client";

import AppointmentCalendar from "@/components/appointment-calendar";
import AppointmentSlots from "@/components/appointment-slots";
import BackgroundSlideShow from "@/components/background-slideshow";
import MainLayout from "@/components/layouts/main-layout";
import { useBranchStore } from "@/stores/branch-store";
import { MonthDay } from "@/types";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const importantNotes = [
  "Appointments can only be booked within the next 7 days.",
  "Please try to arrive at least 30 minutes before your appointment.",
  "If you're late, your appointment may be canceled and changed to a walk-in.",
];

export default function Dashboard() {
  const router = useRouter();
  const [, setSelectedDate] = useState<Date | undefined>();
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
    if (!selectedBranch) router.push("/select-service-hub");
  }, [selectedBranch, router]);

  return (
    <BackgroundSlideShow blur={50} overlayOpacity={0.8} interval={15000}>
      <MainLayout>
        <div className="flex w-full max-w-6xl flex-col gap-6 px-4 md:flex-row">
          <div className="mx-auto flex-1">
            <AppointmentCalendar onDateSelect={handleDateSelect} />
          </div>

          <div className="flex-1 space-y-4">
            <AppointmentSlots monthDay={selectedMonthDay} />

            <Separator className="my-4 h-px w-full bg-gray-300 dark:bg-gray-600" />

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <h3 className="text-md mb-2 font-semibold text-yellow-800 md:text-lg">
                Important Notes
              </h3>
              <ul className="space-y-1 text-sm text-yellow-700">
                {importantNotes.map((note, idx) => (
                  <li key={idx}>• {note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </MainLayout>
    </BackgroundSlideShow>
  );
}
