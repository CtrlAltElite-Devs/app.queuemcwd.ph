"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useDateToMonthDay, useMonthDaysMap } from "@/hooks/use-month-days";
import { useGetAppointmentSlots } from "@/services/get-appointment-slots";
import { Appointment, MonthDay, Slot } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { format, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { MdEventAvailable } from "react-icons/md";
import AppointmentConfirmation from "./appointment-confirmation";
import AppointmentForm from "./appointment-form";
import SlotsGridSkeleton from "./skeletons/slots-grid-skeleton";
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createdAppointment, setCreatedAppointment] =
    useState<Appointment | null>(null);
  const queryClient = useQueryClient();

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

  if (!currentMonthDay || monthDaysLoading || slotsLoading) {
    const placeholderCount = 8; // 2 rows × 4 columns

    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <Skeleton className="h-6 w-1/3 rounded-md bg-gray-200" />
        <SlotsGridSkeleton placeholderCount={placeholderCount} />
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

  const onAppointmentCreated = (appointment: Appointment) => {
    queryClient.invalidateQueries({ queryKey: ["appointment-slots", dayId] });
    setCreatedAppointment(appointment);
    setShowConfirmation(true);
  };

  if (createdAppointment && selectedSlot && showConfirmation) {
    return (
      <AppointmentConfirmation
        appointment={createdAppointment}
        slot={selectedSlot}
        onClose={() => setShowConfirmation(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Temporary rani na indicator  */}
      <div className="flex items-center gap-3">
        <MdEventAvailable size={20} />
        <h2 className="text-md font-semibold text-gray-700">
          Available Slots for{" "}
          {currentMonthDay
            ? format(
                new Date(
                  currentMonthDay.year,
                  currentMonthDay.month - 1,
                  currentMonthDay.day,
                ),
                "MMMM d, yyyy",
              )
            : ""}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => (
          <Dialog key={slot.id}>
            <DialogTrigger>
              <AppointmentSlot
                slot={slot}
                onSelect={() => setSelectedSlot(slot)}
              />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter your details</DialogTitle>
              </DialogHeader>
              <AppointmentForm
                selectedSlot={selectedSlot}
                onAppointmentCreated={onAppointmentCreated}
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
