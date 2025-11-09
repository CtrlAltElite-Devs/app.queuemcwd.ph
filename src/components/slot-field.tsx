import { Slot } from "@/types";
import { calculateDuration, formatTimeForInput } from "@/utils/slot-utils";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
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
}

export default function SlotField({
  slot,
  index,
  onUpdate,
  onDelete,
  allSlots,
  pending,
  pendingAddedSlots,
}: SlotFieldProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const validateSlot = (slotToValidate: Slot): string[] => {
    const newErrors: string[] = [];

    const startTime = new Date(slotToValidate.startTime);
    const endTime = new Date(slotToValidate.endTime);

    // Validate start time is before end time
    if (startTime >= endTime) {
      console.log("❌ Time validation failed - start >= end");
      newErrors.push("End time must be after start time");
      return newErrors; // No need to check collisions if times are invalid
    }

    // Check for collisions with other slots
    [...allSlots, ...(pendingAddedSlots || [])].forEach(
      (otherSlot, otherIndex) => {
        if (otherSlot.id === slotToValidate.id) return;

        const otherStart = new Date(otherSlot.startTime);
        const otherEnd = new Date(otherSlot.endTime);

        // Check for time overlap
        if (startTime < otherEnd && endTime > otherStart) {
          newErrors.push(
            `Overlaps with slot ${otherIndex + 1} (${formatTimeForInput(otherSlot.startTime)} - ${formatTimeForInput(otherSlot.endTime)})`,
          );
        }
      },
    );

    return newErrors;
  };

  const validateTimeChange = (
    field: "startTime" | "endTime",
    newValue: string,
  ) => {
    // Create updated slot with the change
    const updatedSlot = { ...slot };

    const [hours, minutes] = newValue.split(":").map(Number);

    if (field === "startTime") {
      const newStartTime = new Date(slot.startTime);
      newStartTime.setHours(hours, minutes, 0, 0);
      updatedSlot.startTime = newStartTime;
    } else {
      const newEndTime = new Date(slot.endTime);
      newEndTime.setHours(hours, minutes, 0, 0);
      updatedSlot.endTime = newEndTime;
    }

    const newErrors = validateSlot(updatedSlot);
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    const isValid = validateTimeChange(field, value);

    if (isValid) {
      const [hours, minutes] = value.split(":").map(Number);
      const newTime = new Date(slot[field]);
      newTime.setHours(hours, minutes, 0, 0);

      onUpdate({ [field]: newTime });
    }
  };

  const handleCapacityChange = (value: string) => {
    const capacity = parseInt(value);
    if (!isNaN(capacity) && capacity >= 0) {
      onUpdate({ maxCapacity: capacity });
    }
  };

  const availableCapacity = slot.maxCapacity - slot.booked;

  return (
    <div
      className={`space-y-3 rounded-lg border p-4 ${errors.length > 0 ? "border-red-300 bg-red-50" : "border-gray-200"}`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          {!pending ? `Slot ${index + 1}` : "New"}
        </h4>
        {errors.length > 0 && (
          <span className="text-xs font-medium text-red-600">
            {errors.length} issue{errors.length > 1 ? "s" : ""}
          </span>
        )}
        {pending && <small>Pending</small>}
      </div>

      <div className="grid grid-cols-5 items-center gap-4">
        <div className="space-y-1">
          <Label
            className="text-xs text-gray-500"
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
          />
        </div>

        <div className="space-y-1">
          <Label
            className="text-xs text-gray-500"
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
          />
        </div>

        <div className="space-y-1">
          <Label
            className="text-xs text-gray-500"
            htmlFor={`duration-${slot.id}`}
          >
            Duration
          </Label>
          <Input
            readOnly
            value={calculateDuration(slot.startTime, slot.endTime)}
            className="bg-gray-50 text-sm"
            id={`duration-${slot.id}`}
          />
        </div>

        <div className="space-y-1">
          <Label
            className="text-xs text-gray-500"
            htmlFor={`capacity-${slot.id}`}
          >
            Available Capacity
          </Label>
          <Input
            type="number"
            min="0"
            max={slot.maxCapacity}
            value={availableCapacity}
            onChange={(e) => handleCapacityChange(e.target.value)}
            className="text-sm"
            id={`capacity-${slot.id}`}
          />
          <div className="text-xs text-gray-500">
            Booked: {slot.booked} / Max: {slot.maxCapacity}
          </div>
        </div>

        <div className="flex justify-center">
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
    </div>
  );
}
