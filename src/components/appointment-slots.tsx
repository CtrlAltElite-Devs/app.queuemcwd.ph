"use client";

import {
  shimmerSlotTemplateMonthDay,
  shimmerSlotTemplates,
} from "@/components/shimmer-templates";
import { AppShimmer } from "@/components/ui/app-shimmer";
import { useDateToMonthDay, useMonthDaysMap } from "@/hooks/use-month-days";
import { useGetAppointmentSlotsV2 } from "@/services/get-appointment-slots";
import { useBranchStore } from "@/stores/branch-store";
import { Appointment, MonthDay, Slot } from "@/types";
import { getNextWorkingDay } from "@/utils/next-working-day";
import { formatSlotTime } from "@/utils/slot-utils";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Calendar1, ClockIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MdEventAvailable } from "react-icons/md";
import AppointmentConfirmation from "./appointment-confirmation";
import AppointmentForm from "./forms/appointment-form";
import AppointmentSlot from "./slot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface AppointmentSlotsProps {
  monthDay?: MonthDay;
}

function AppointmentSlotsCard({
  formattedDate,
  currentMonthDayId,
  slots,
  onSlotSelect,
  onAppointmentCreated,
}: {
  formattedDate: string;
  currentMonthDayId: string;
  slots: Slot[];
  onSlotSelect: (slot: Slot) => void;
  onAppointmentCreated: (appointment: Appointment) => void;
}) {
  return (
    <div className="bg-background/15 space-y-4 rounded-3xl p-4">
      <AppointmentSlotsHeader
        formattedDate={formattedDate}
        currentMonthDayId={currentMonthDayId}
      />
      <AppointmentSlotsGrid
        currentMonthDayId={currentMonthDayId}
        formattedDate={formattedDate}
        slots={slots}
        onSlotSelect={onSlotSelect}
        onAppointmentCreated={onAppointmentCreated}
      />
    </div>
  );
}

function AppointmentSlotsHeader({
  formattedDate,
  currentMonthDayId,
}: {
  formattedDate: string;
  currentMonthDayId: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <MdEventAvailable size={20} />
      <p className="text-md dark:text-primary-foreground">
        Available Slots for{" "}
        <span
          key={currentMonthDayId}
          className="animate-fadeBasic font-semibold"
        >
          {formattedDate}
        </span>
      </p>
    </div>
  );
}

function AppointmentSlotsGrid({
  currentMonthDayId,
  formattedDate,
  slots,
  onSlotSelect,
  onAppointmentCreated,
}: {
  currentMonthDayId: string;
  formattedDate: string;
  slots: Slot[];
  onSlotSelect: (slot: Slot) => void;
  onAppointmentCreated: (appointment: Appointment) => void;
}) {
  return (
    <div
      key={`slots-${currentMonthDayId}`}
      className="page-fade grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {slots.map((slot) => (
        <Dialog key={slot.id}>
          <DialogTrigger>
            <AppointmentSlot slot={slot} onSelect={() => onSlotSelect(slot)} />
          </DialogTrigger>
          <DialogContent className="bg-background rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-blue-500">
                Create Appointment
              </DialogTitle>
              <DialogDescription asChild>
                <div>
                  <p className="my-2 flex flex-row items-center gap-1">
                    <Calendar1 size={16} />
                    {formattedDate}
                  </p>
                  <p className="my-2 flex flex-row items-center gap-1">
                    <ClockIcon size={16} />
                    {formatSlotTime(slot.startTime)} -{" "}
                    {formatSlotTime(slot.endTime)}
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm
              selectedSlot={slot}
              onAppointmentCreated={onAppointmentCreated}
            />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

export default function AppointmentSlots({ monthDay }: AppointmentSlotsProps) {
  const { selectedBranch } = useBranchStore();
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
      const nextWorking = getNextWorkingDay(monthDaysMap);
      if (!nextWorking) return;
      const todayMonthDay = getMonthDayFromDate(nextWorking);

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
    data,
    isLoading: slotsLoading,
    error,
  } = useGetAppointmentSlotsV2(dayId, selectedBranch?.id);

  const formattedDate = useMemo(() => {
    if (!currentMonthDay) return "";
    return format(
      new Date(
        currentMonthDay.year,
        currentMonthDay.month - 1,
        currentMonthDay.day,
      ),
      "MMMM d, yyyy",
    );
  }, [currentMonthDay]);

  const onAppointmentCreated = (appointment: Appointment) => {
    queryClient.invalidateQueries({ queryKey: ["appointment-slots", dayId] });
    setCreatedAppointment(appointment);
    setShowConfirmation(true);
  };

  if (!currentMonthDay || monthDaysLoading || slotsLoading || !selectedBranch) {
    return (
      <div className="bg-background/15 space-y-4 rounded-3xl p-4">
        <AppointmentSlotsHeader
          formattedDate="Loading date..."
          currentMonthDayId={shimmerSlotTemplateMonthDay.id}
        />
        <AppShimmer
          loading={true}
          templateProps={{
            currentMonthDayId: shimmerSlotTemplateMonthDay.id,
            formattedDate: "March 24, 2026",
            slots: shimmerSlotTemplates,
            onSlotSelect: () => undefined,
            onAppointmentCreated: () => undefined,
          }}
        >
          <AppointmentSlotsGrid
            currentMonthDayId={currentMonthDay?.id || ""}
            formattedDate=""
            slots={[]}
            onSlotSelect={() => undefined}
            onAppointmentCreated={() => undefined}
          />
        </AppShimmer>
      </div>
    );
  }

  if (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An unexpected error occurred.";

    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center text-lg text-[#B50505]">{message}</div>
      </div>
    );
  }

  if (data?.slots.length === 0) {
    if (!selectedBranch) {
      return <div />;
    }

    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-lg text-gray-700">{data.additionalNotes}</div>
      </div>
    );
  }

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
    <AppointmentSlotsCard
      formattedDate={formattedDate}
      currentMonthDayId={currentMonthDay.id}
      slots={data?.slots ?? []}
      onSlotSelect={setSelectedSlot}
      onAppointmentCreated={onAppointmentCreated}
    />
  );
}
