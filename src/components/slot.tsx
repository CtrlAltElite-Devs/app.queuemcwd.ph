"use client";

import { cn } from "@/lib/utils";
import { useBranchStore } from "@/stores/branch-store";
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
  const { selectedBranch } = useBranchStore();

  const available = slot.maxCapacity - slot.booked;
  const isFull = available === 0;
  const isDisabled = !slot.isActive || isFull;

  const handleClick = (e: React.MouseEvent) => {
    if (!selectedBranch) return;

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
        "flex min-h-16 min-w-24 flex-col items-center justify-center gap-2",
        "lg:text-md text-sm shadow-md",
        isDisabled
          ? "bg-secondary cursor-not-allowed opacity-60"
          : isSelected
            ? "bg-primary border-primary text-primary-foreground scale-105 shadow-lg"
            : "hover:border-primary dark:bg-background bg-white hover:scale-102 hover:cursor-pointer hover:shadow-lg",
      )}
      aria-label={`${slot.startTime} - ${slot.endTime}, ${available} slots available`}
    >
      <div className="lg:text-md text-md font-semibold">
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
            <Users className="h-4 w-4 text-[#006605] opacity-50 dark:text-[#DDFFAB]" />
            <span className="opacity-80">{available} available</span>
          </>
        )}
      </div>
    </div>
  );
}
