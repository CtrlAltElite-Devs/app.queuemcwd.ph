"use client";

import type { Slot } from "@/types";
import { formatTimeToHHmm } from "@/utils";
import {
  calculateDuration,
  formatTimeForInput,
  isTimeFormat,
  timeToMinutes,
} from "@/utils/slot-utils";
import { Check, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SlotFieldProps {
  slot: Slot;
  index: number;
  onUpdate: (updates: Partial<Slot>) => void;
  onDelete: () => void;
  allSlots: Slot[];
  pendingAddedSlots?: Slot[];
  pending?: boolean;
  onAddSlot?: (slot: Slot) => void;
  onSaveChanges?: (slot: Slot) => void;
  onDiscardChanges?: () => void;
}

export default function SlotField({
  slot,
  index,
  onUpdate,
  onDelete,
  allSlots,
  pending,
  pendingAddedSlots,
  onAddSlot,
  onSaveChanges,
  onDiscardChanges,
}: SlotFieldProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const initialSlotRef = useRef<Slot>(slot);

  const detectChanges = () => {
    return (
      formatTimeToHHmm(slot.startTime) !==
        formatTimeToHHmm(initialSlotRef.current.startTime) ||
      formatTimeToHHmm(slot.endTime) !==
        formatTimeToHHmm(initialSlotRef.current.endTime) ||
      slot.maxCapacity !== initialSlotRef.current.maxCapacity
    );
  };

  useEffect(() => {
    setHasChanges(detectChanges());
  }, [slot.startTime, slot.endTime, slot.maxCapacity]);

  const validateSlot = (slotToValidate: Slot): string[] => {
    const newErrors: string[] = [];

    // Convert to strings first, regardless of original type
    const startTimeStr = isTimeFormat(slot.startTime)
      ? slotToValidate.startTime
      : formatTimeToHHmm(slotToValidate.startTime);

    const endTimeStr = isTimeFormat(slot.endTime)
      ? slotToValidate.endTime
      : formatTimeToHHmm(slotToValidate.endTime);

    const startMinutes = timeToMinutes(startTimeStr as string);
    const endMinutes = timeToMinutes(endTimeStr as string);

    console.log("Validating times:", {
      start: startTimeStr,
      end: endTimeStr,
      startMinutes,
      endMinutes,
    });

    if (startMinutes >= endMinutes) {
      newErrors.push("End time must be after start time");
      return newErrors;
    }

    const normalizeSlotForComparison = (slot: Slot) => {
      return {
        ...slot,
        startTime: isTimeFormat(slot.startTime)
          ? slot.startTime
          : formatTimeToHHmm(slot.startTime),
        endTime: isTimeFormat(slot.endTime)
          ? slot.endTime
          : formatTimeToHHmm(slot.endTime),
      };
    };

    const allNormalizedSlots = [
      ...allSlots.map(normalizeSlotForComparison),
      ...(pendingAddedSlots || []).map(normalizeSlotForComparison),
    ];

    allNormalizedSlots.forEach((otherSlot, otherIndex) => {
      if (otherSlot.id === slotToValidate.id) {
        console.log(`Skipping self-comparison with slot ${otherIndex}`);
        return;
      }

      const otherStart = timeToMinutes(otherSlot.startTime as string);
      const otherEnd = timeToMinutes(otherSlot.endTime as string);

      console.log(
        `🔍 Comparing slot ${slotToValidate.id} with slot ${otherSlot.id}:`,
      );
      console.log(
        `  Current: ${startTimeStr} (${startMinutes}m) - ${endTimeStr} (${endMinutes}m)`,
      );
      console.log(
        `  Other:   ${otherSlot.startTime} (${otherStart}m) - ${otherSlot.endTime} (${otherEnd}m)`,
      );

      // Check for time overlap with detailed conditions
      const condition1 = startMinutes < otherEnd;
      const condition2 = endMinutes > otherStart;
      const hasOverlap = condition1 && condition2;

      if (hasOverlap) {
        console.log(`OVERLAP DETECTED between slots!`);
        newErrors.push(
          `Overlaps with slot ${otherIndex + 1} (${otherSlot.startTime} - ${otherSlot.endTime})`,
        );
      } else {
        console.log(`✅ No overlap`);
      }
      console.log("---");
    });

    return newErrors;
  };

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    const updatedSlot = { ...slot, [field]: value };

    const newErrors = validateSlot(updatedSlot);
    setErrors(newErrors);

    onUpdate({ [field]: value });
  };

  const handleCapacityChange = (value: string) => {
    const capacity = Number.parseInt(value);
    if (!isNaN(capacity) && capacity >= 0) {
      onUpdate({ maxCapacity: capacity });
    }
  };

  const handleReset = () => {
    console.log("reset called");
    onDiscardChanges?.();
    setHasChanges(false);
    setErrors([]);
  };

  const availableCapacity = slot.maxCapacity - slot.booked;

  const getSlotStyles = () => {
    if (!slot.isActive) {
      return "border-gray-200 bg-gray-50 opacity-75";
    }
    if (pending) {
      return "border-amber-300 bg-amber-50";
    }
    if (hasChanges) {
      return "border-blue-300 bg-blue-50";
    }
    if (errors.length > 0) {
      return "border-red-300 bg-red-50";
    }
    return "border-gray-200 bg-white hover:border-gray-300";
  };

  return (
    <div
      className={`space-y-3 rounded-lg border p-4 transition-all ${getSlotStyles()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4
            className={`text-sm font-medium ${!slot.isActive ? "text-gray-400" : "text-gray-700"}`}
          >
            {!pending ? `Slot ${index + 1}` : "New Slot"}
          </h4>
          {!slot.isActive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
              <EyeOff className="h-3 w-3" />
              Inactive
            </span>
          )}
          {pending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
              Pending
            </span>
          )}
          {hasChanges && !pending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-200 px-3 py-1 text-xs font-semibold text-blue-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
              Modified
            </span>
          )}
        </div>
        {errors.length > 0 && (
          <span className="text-xs font-medium text-red-600">
            {errors.length} issue{errors.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 items-center gap-4">
        <div className="space-y-1">
          <Label
            className={`text-xs ${!slot.isActive ? "text-gray-400" : "text-gray-500"}`}
            htmlFor={`startTime-${slot.id}`}
          >
            Start Time
          </Label>
          <Input
            type="time"
            className="text-sm"
            defaultValue={formatTimeForInput(slot.startTime)}
            onChange={(e) => handleTimeChange("startTime", e.target.value)}
            id={`startTime-${slot.id}`}
            disabled={!slot.isActive}
          />
        </div>

        <div className="space-y-1">
          <Label
            className={`text-xs ${!slot.isActive ? "text-gray-400" : "text-gray-500"}`}
            htmlFor={`endTime-${slot.id}`}
          >
            End Time
          </Label>
          <Input
            type="time"
            className="text-sm"
            defaultValue={formatTimeForInput(slot.endTime)}
            onChange={(e) => handleTimeChange("endTime", e.target.value)}
            id={`endTime-${slot.id}`}
            disabled={!slot.isActive}
          />
        </div>

        <div className="space-y-1">
          <Label
            className={`text-xs ${!slot.isActive ? "text-gray-400" : "text-gray-500"}`}
            htmlFor={`duration-${slot.id}`}
          >
            Duration
          </Label>
          <Input
            readOnly
            value={calculateDuration(slot.startTime, slot.endTime)}
            className={`text-sm ${!slot.isActive ? "bg-gray-100 text-gray-400" : "bg-gray-50"}`}
            id={`duration-${slot.id}`}
          />
        </div>

        <div className="space-y-1">
          <Label
            className={`text-xs ${!slot.isActive ? "text-gray-400" : "text-gray-500"}`}
            htmlFor={`capacity-${slot.id}`}
          >
            Available Capacity
          </Label>
          <Input
            type="number"
            min="0"
            max={5}
            value={availableCapacity}
            onChange={(e) => handleCapacityChange(e.target.value)}
            className="text-sm"
            id={`capacity-${slot.id}`}
            disabled={!slot.isActive}
          />
          <div
            className={`text-xs ${!slot.isActive ? "text-gray-400" : "text-gray-500"}`}
          >
            Booked: {slot.booked} / Max: {slot.maxCapacity}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onDelete}
            className="p-2 text-red-400 transition-colors hover:text-red-600"
            disabled={slot.booked > 0}
            title={
              slot.booked > 0
                ? "Cannot delete slot with existing bookings"
                : "Delete slot"
            }
          >
            <FaTrashCan className={slot.booked > 0 ? "opacity-50" : ""} />
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, errorIndex) => (
            <div
              key={errorIndex}
              className="flex items-center gap-1 text-xs text-red-600"
            >
              <span>•</span>
              {error}
            </div>
          ))}
        </div>
      )}

      {hasChanges && !pending && (
        <div className="flex gap-2 border-t border-blue-200 pt-3">
          <Button
            onClick={() => {
              setIsSubmitting(true);
              try {
                onSaveChanges?.(slot);
                setHasChanges(false);
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={errors.length > 0 || isSubmitting}
            className="flex flex-1 items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={() => handleReset()}
            variant="outline"
            disabled={isSubmitting}
            className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            ✕ Discard
          </Button>
        </div>
      )}

      {pending && (
        <div className="flex gap-2 border-t border-amber-200 pt-3">
          <Button
            onClick={async () => {
              setIsSubmitting(true);
              try {
                await onAddSlot?.(slot);
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={errors.length > 0 || isSubmitting}
            className="flex flex-1 items-center gap-2 bg-amber-600 text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Slot"}
          </Button>
        </div>
      )}
    </div>
  );
}
