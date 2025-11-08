"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@/types";
import { formatSlotTime } from "@/utils/slot-utils";
import { CheckCircle2, Users } from "lucide-react";

interface AppointmentSlotProps {
  slot: Slot;
  onSelect: (slotId: string) => void;
  isSelected?: boolean;
}

export default function AppointmentSlot({
  slot,
  onSelect,
  isSelected,
}: AppointmentSlotProps) {
  const available = slot.maxCapacity - slot.booked;
  const isFull = available === 0;
  const isDisabled = !slot.isActive || isFull;

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      e.stopPropagation();
      return;
    }
    onSelect(slot.id);
  };

  return (
    <div
      onClick={handleClick}
      aria-disabled={isDisabled}
      className={cn(
        "rounded-2xl border p-4 transition-all duration-200",
        "flex min-h-[4rem] min-w-[6rem] flex-col items-center justify-center gap-2",
        "text-sm lg:text-base",
        isDisabled
          ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400 opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
          : isSelected
            ? "bg-primary border-primary text-primary-foreground scale-105 shadow-lg"
            : "hover:border-primary border-gray-300 bg-white text-gray-900 hover:scale-102 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
      )}
      aria-label={`${slot.startTime} - ${slot.endTime}, ${available} slots available`}
    >
      <div className="font-semibold">
        {formatSlotTime(slot.startTime)} - {formatSlotTime(slot.endTime)}
      </div>
      <div className="flex items-center justify-center gap-1 text-xs md:text-sm">
        {isFull ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-red-500" />
            <span>Full</span>
          </>
        ) : (
          <>
            <Users className="h-4 w-4 text-green-500 opacity-50" />
            <span className="opacity-80">{available} available</span>
          </>
        )}
      </div>
    </div>
  );
}
