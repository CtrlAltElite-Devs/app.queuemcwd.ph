"use client";

import AppointmentCalendar from "@/components/appointment-calendar";
import AppointmentSlotFields from "@/components/appointment-slot-fields";
import { LoadingState } from "@/components/ui/loading-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBranchStore } from "@/stores/branch-store";
import { MonthDay } from "@/types";
import { format } from "date-fns";
import { CalendarClock, CalendarDays } from "lucide-react";
import { useCallback, useState } from "react";

export default function AppointmentSettings() {
  const { selectedBranch } = useBranchStore();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedMonthDay, setSelectedMonthDay] = useState<MonthDay>();

  const handleSelectDate = useCallback(
    (date: Date | undefined, monthDay: MonthDay | undefined) => {
      setSelectedDate(date);
      setSelectedMonthDay(monthDay);
    },
    [],
  );

  if (!selectedBranch) {
    return (
      <LoadingState label="Loading appointments..." className="min-h-[40vh]" />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary dark:bg-primary/20 flex size-9 items-center justify-center rounded-lg">
            <CalendarClock className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Appointments</h1>
            <p className="text-muted-foreground text-sm">
              Manage time slots and appointments for{" "}
              <span className="text-primary font-medium">
                {selectedBranch.name}
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[auto_minmax(0,1fr)]">
        <Card className="sticky top-4 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="text-primary size-4" />
              Select Date
            </CardTitle>
            <CardDescription>
              Pick a date to view and manage its slots.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentCalendar onDateSelect={handleSelectDate} />
            {selectedDate && selectedMonthDay && (
              <div className="bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30 mt-4 rounded-lg border px-4 py-3">
                <p className="text-sm font-medium">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-xs">
                  {selectedMonthDay.isWorkingDay ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Working day
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">
                      Non-working day
                    </span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <AppointmentSlotFields
          monthDayId={selectedMonthDay?.id || ""}
          isWorkingDay={selectedMonthDay?.isWorkingDay}
          hasDateSelected={!!selectedMonthDay}
        />
      </div>
    </div>
  );
}
