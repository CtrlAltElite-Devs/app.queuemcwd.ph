"use client";

import { formatSlotTime } from "@/lib/slot-utils";
import { cn } from "@/lib/utils";
import { Slot } from "@/types";
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

  const handleClick = () => {
    if (!isDisabled) {
      onSelect(slot.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      aria-disabled={isDisabled}
      className={cn(
        "rounded-lg border-2 p-4 transition-all duration-200",
        "flex flex-col items-center justify-center gap-2",
        isDisabled
          ? "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50"
          : isSelected
            ? "bg-primary border-primary text-primary-foreground scale-105 shadow-lg"
            : "bg-card border-border text-foreground hover:border-primary hover:scale-102 hover:shadow-md",
      )}
      aria-label={`${slot.startTime} - ${slot.endTime}, ${available} slots available`}
    >
      <div className="text-sm font-semibold">
        {formatSlotTime(slot.startTime)} - {formatSlotTime(slot.endTime)}
      </div>
      <div className="flex items-center justify-center gap-1 text-xs">
        {isFull ? (
          <>
            <CheckCircle2 className="h-3 w-3" />
            <span>Full</span>
          </>
        ) : (
          <>
            <Users className="h-3 w-3" />
            <span>{available} available</span>
          </>
        )}
      </div>
    </div>
  );
}
