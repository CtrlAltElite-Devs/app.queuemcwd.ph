"use client";

import AppointmentCalendar from "@/components/appointment-calendar";
import AppointmentSlots from "@/components/appointment-slots";
import BackgroundSlideShow from "@/components/background-slideshow";
import { CalendarLegend } from "@/components/calendar-legend";
import { FABDialogCalendarLegend } from "@/components/fab-dialog-calendar-legend";
import ImportantNotesSection from "@/components/important-notes-section";
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
  const [selectedMonthDay, setSelectedMonthDay] = useState<
    MonthDay | undefined
  >();

  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const hasHydrated = useBranchStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!selectedBranch) {
      router.replace("/select-service-hub");
    }
  }, [selectedBranch, hasHydrated, router]);

  const handleDateSelect = useCallback(
    (date: Date | undefined, monthDay: MonthDay | undefined) => {
      setSelectedDate(date);
      setSelectedMonthDay(monthDay);
    },
    [],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <BackgroundSlideShow blur={50} overlayOpacity={0.8} interval={15000}>
        <MainLayout>
          <div className="flex w-full max-w-6xl flex-col gap-6 px-4">
            <div className="hidden w-full gap-6 lg:flex">
              <div className="bg-background/40 fixed right-6 bottom-18 z-50 flex flex-col rounded-lg p-2 shadow-lg">
                <h1 className="mt-2 ml-4 text-sm font-semibold">Legend</h1>
                <CalendarLegend />
              </div>

              {/* Calendar in CENTER */}
              <div className="flex-1">
                <AppointmentCalendar onDateSelect={handleDateSelect} />
              </div>

              <div className="flex-1 space-y-4">
                <AppointmentSlots monthDay={selectedMonthDay} />
                <Separator className="my-4 h-px w-full bg-gray-300 dark:bg-gray-600" />
                <ImportantNotesSection importantNotes={importantNotes} />
              </div>
            </div>

            {/* Mobile layout */}
            <div className="flex flex-col items-center gap-6 lg:hidden">
              <AppointmentCalendar onDateSelect={handleDateSelect} />
              <AppointmentSlots monthDay={selectedMonthDay} />
              <Separator className="my-4 h-px w-full bg-gray-300 dark:bg-gray-600" />
              <ImportantNotesSection importantNotes={importantNotes} />
            </div>
            <FABDialogCalendarLegend />
          </div>
        </MainLayout>
      </BackgroundSlideShow>
    </>
  );
}
