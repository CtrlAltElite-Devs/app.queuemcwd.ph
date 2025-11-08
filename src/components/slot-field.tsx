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
}

export default function SlotField({
  slot,
  index,
  onUpdate,
  onDelete,
  allSlots,
}: SlotFieldProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const validateTimeChange = (
    field: "startTime" | "endTime",
    newValue: string,
  ) => {
    const updatedSlot = { ...slot };

    if (field === "startTime") {
      const [hours, minutes] = newValue.split(":").map(Number);
      const newStartTime = new Date(slot.startTime);
      newStartTime.setHours(hours, minutes, 0, 0);
      updatedSlot.startTime = newStartTime;
    } else {
      const [hours, minutes] = newValue.split(":").map(Number);
      const newEndTime = new Date(slot.endTime);
      newEndTime.setHours(hours, minutes, 0, 0);
      updatedSlot.endTime = newEndTime;
    }

    // Check for collisions with other slots
    const newErrors: string[] = [];

    allSlots.forEach((otherSlot, otherIndex) => {
      if (otherSlot.id === slot.id) return;

      const thisStart = new Date(updatedSlot.startTime);
      const thisEnd = new Date(updatedSlot.endTime);
      const otherStart = new Date(otherSlot.startTime);
      const otherEnd = new Date(otherSlot.endTime);

      // Check for time overlap
      if (thisStart < otherEnd && thisEnd > otherStart) {
        newErrors.push(
          `Overlaps with slot ${otherIndex + 1} (${formatTimeForInput(otherSlot.startTime)} - ${formatTimeForInput(otherSlot.endTime)})`,
        );
      }
    });

    // Validate start time is before end time
    if (updatedSlot.startTime >= updatedSlot.endTime) {
      newErrors.push("End time must be after start time");
    }

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
        <h4 className="text-sm font-medium text-gray-700">Slot {index + 1}</h4>
        {errors.length > 0 && (
          <span className="text-xs font-medium text-red-600">
            {errors.length} issue{errors.length > 1 ? "s" : ""}
          </span>
        )}
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
