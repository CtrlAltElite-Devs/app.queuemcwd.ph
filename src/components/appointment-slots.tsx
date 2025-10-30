"use client";

import { useDateToMonthDay, useMonthDaysMap } from "@/hooks/use-month-days";
import { useGetAppointmentSlots } from "@/services/get-appointment-slots";
import { MonthDay, Slot } from "@/types";
import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import AppointmentForm from "./appointment-form";
import AppointmentSlot from "./slot";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface AppointmentSlotsProps {
  monthDay?: MonthDay;
}

export default function AppointmentSlots({ monthDay }: AppointmentSlotsProps) {
  const [currentMonthDay, setCurrentMonthDay] = useState<MonthDay | undefined>(
    monthDay,
  );

  const { monthDaysMap, isLoading: monthDaysLoading } = useMonthDaysMap(
    new Date().getMonth() + 1,
  );
  const { getMonthDayFromDate } = useDateToMonthDay(monthDaysMap);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    if (!monthDay && !monthDaysLoading && monthDaysMap.size > 0) {
      const today = startOfDay(new Date());
      const todayMonthDay = getMonthDayFromDate(today);

      if (currentMonthDay?.id !== todayMonthDay?.id) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentMonthDay(todayMonthDay);
      }
    } else if (monthDay && monthDay.id !== currentMonthDay?.id) {
      setCurrentMonthDay(monthDay);
    }
  }, [
    monthDay,
    monthDaysLoading,
    monthDaysMap,
    getMonthDayFromDate,
    currentMonthDay,
  ]);

  const dayId = currentMonthDay?.id || "";

  const {
    data: slots = [],
    isLoading: slotsLoading,
    error,
  } = useGetAppointmentSlots(dayId);

  // Show loading state while determining the current day
  if (!currentMonthDay || monthDaysLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-lg">Loading available slots...</div>
      </div>
    );
  }

  if (slotsLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-lg">Loading available slots...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-lg text-red-600">Error loading slots</div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-lg text-gray-500">
          No available slots for {currentMonthDay.month}/{currentMonthDay.day}/
          {currentMonthDay.year}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Temporary rani na indicator  */}
      <h2 className="text-xl font-semibold">
        Available Slots for {currentMonthDay.month}/{currentMonthDay.day}/
        {currentMonthDay.year}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => (
          <Dialog key={slot.id}>
            <DialogTrigger>
              <AppointmentSlot
                slot={slot}
                onSelect={() => {
                  console.log("giselect ko", slot.id);
                  setSelectedSlot(slot)
                }}
              />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter your details</DialogTitle>
              </DialogHeader>
              <AppointmentForm slot={selectedSlot}/>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
