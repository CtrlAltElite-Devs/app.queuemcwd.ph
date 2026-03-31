"use client";

import type { Slot } from "@/types";
import { formatTimeToHHmm } from "@/utils";
import {
  calculateDuration,
  formatSlotTime,
  formatTimeForInput,
  isTimeFormat,
  timeToMinutes,
} from "@/utils/slot-utils";
import { Check, EyeOff, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";
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
  onSaveChanges?: (slot: Slot, originalSlot: Slot) => void;
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
}: SlotFieldProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const initialSlotRef = useRef<Slot>(slot);

  useEffect(() => {
    if (!hasChanges) {
      initialSlotRef.current = slot;
    }
  }, [slot, hasChanges]);

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
    setHasChanges(true);
  };

  const handleCapacityChange = (value: string) => {
    const capacity = Number.parseInt(value);
    if (!isNaN(capacity) && capacity >= 0) {
      onUpdate({ maxCapacity: capacity });
      setHasChanges(true);
    }
  };

  const handleReset = () => {
    onUpdate({
      startTime: initialSlotRef.current.startTime,
      endTime: initialSlotRef.current.endTime,
      maxCapacity: initialSlotRef.current.maxCapacity,
    });
    setHasChanges(false);
    setErrors([]);
  };

  const availableCapacity = slot.maxCapacity - slot.booked;
  const isLocked = slot.booked > 0 && !pending;
  const isFull = slot.booked >= slot.maxCapacity;

  const getSlotStyles = () => {
    if (!slot.isActive) {
      return "border-border border-l-muted-foreground/20 bg-muted/30 opacity-75";
    }
    if (isLocked && isFull) {
      return "border-border/80 border-l-rose-300/50 bg-rose-50/10 dark:border-border/50 dark:border-l-rose-400/30 dark:bg-rose-950/5";
    }
    if (isLocked) {
      return "border-border/80 border-l-teal-300/50 bg-teal-50/10 dark:border-border/50 dark:border-l-teal-400/30 dark:bg-teal-950/5";
    }
    if (pending) {
      return "border-amber-200/40 border-l-amber-400/50 bg-amber-50/15 dark:border-amber-800/25 dark:border-l-amber-400/35 dark:bg-amber-950/5";
    }
    if (hasChanges) {
      return "border-blue-200/40 border-l-blue-400/50 bg-blue-50/15 dark:border-blue-800/25 dark:border-l-blue-400/35 dark:bg-blue-950/5";
    }
    if (errors.length > 0) {
      return "border-red-200/40 border-l-red-400/50 bg-red-50/15 dark:border-red-800/25 dark:border-l-red-400/35 dark:bg-red-950/5";
    }
    return "border-border border-l-primary/25 bg-background hover:border-primary/15 dark:border-l-primary/35 dark:hover:border-primary/20";
  };

  if (isLocked) {
    const filledSegmentColor = !slot.isActive
      ? "bg-muted-foreground/30 dark:bg-muted-foreground/20"
      : isFull
        ? "bg-rose-300/60 dark:bg-rose-400/40"
        : "bg-teal-300/60 dark:bg-teal-400/40";

    const emptySegmentColor = !slot.isActive
      ? "bg-muted-foreground/10"
      : isFull
        ? "bg-rose-200/30 dark:bg-rose-800/15"
        : "bg-teal-200/30 dark:bg-teal-800/15";

    const badgeColor = !slot.isActive
      ? "bg-muted text-muted-foreground"
      : isFull
        ? "bg-rose-50 text-rose-500/80 dark:bg-rose-900/20 dark:text-rose-300/70"
        : "bg-teal-50 text-teal-500/80 dark:bg-teal-900/20 dark:text-teal-300/70";

    return (
      <div
        className={`space-y-4 rounded-xl border border-l-[3px] p-4 transition-all ${getSlotStyles()}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4
              className={`text-sm font-medium ${!slot.isActive ? "text-muted-foreground" : "text-foreground"}`}
            >
              Slot {index + 1}
            </h4>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}
            >
              <Lock className="size-3" />
              {isFull ? "Full" : `${slot.booked} booked`}
            </span>
            {!slot.isActive && (
              <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
                <EyeOff className="h-3 w-3" />
                Inactive
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="bg-muted/60 dark:bg-muted/30 rounded-lg px-3 py-2.5">
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Start
            </p>
            <p className="text-sm font-semibold tabular-nums">
              {formatSlotTime(slot.startTime)}
            </p>
          </div>
          <div className="bg-muted/60 dark:bg-muted/30 rounded-lg px-3 py-2.5">
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              End
            </p>
            <p className="text-sm font-semibold tabular-nums">
              {formatSlotTime(slot.endTime)}
            </p>
          </div>
          <div className="border-muted-foreground/20 rounded-lg border border-dashed px-3 py-2.5">
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Duration
            </p>
            <p className="text-muted-foreground text-sm font-medium">
              {calculateDuration(slot.startTime, slot.endTime)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-medium">
              Capacity
            </p>
            <p className="text-xs tabular-nums">
              <span
                className={`font-semibold ${isFull ? "text-rose-500/80 dark:text-rose-400/70" : "text-foreground"}`}
              >
                {slot.booked}
              </span>
              <span className="text-muted-foreground">
                {" "}
                / {slot.maxCapacity} booked
              </span>
            </p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: slot.maxCapacity }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i < slot.booked ? filledSegmentColor : emptySegmentColor
                }`}
              />
            ))}
          </div>
          <p
            className={`text-xs ${isFull ? "font-medium text-rose-500/80 dark:text-rose-400/70" : "text-muted-foreground"}`}
          >
            {isFull
              ? "All slots are booked"
              : `${availableCapacity} slot${availableCapacity !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-3 rounded-xl border border-l-[3px] p-4 transition-all ${getSlotStyles()}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h4
            className={`text-sm font-medium ${!slot.isActive ? "text-muted-foreground" : "text-foreground"}`}
          >
            {!pending ? `Slot ${index + 1}` : "New Slot"}
          </h4>
          {!slot.isActive && (
            <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
              <EyeOff className="h-3 w-3" />
              Inactive
            </span>
          )}
          {pending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/60 px-3 py-1 text-xs font-semibold text-amber-700/80 dark:bg-amber-900/25 dark:text-amber-300/70">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400/80 dark:bg-amber-400/50" />
              Pending
            </span>
          )}
          {hasChanges && !pending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/60 px-3 py-1 text-xs font-semibold text-blue-700/80 dark:bg-blue-900/25 dark:text-blue-300/70">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400/80 dark:bg-blue-400/50" />
              Modified
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {errors.length > 0 && (
            <span className="text-xs font-medium text-red-500/80 dark:text-red-400/70">
              {errors.length} issue{errors.length > 1 ? "s" : ""}
            </span>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                disabled={slot.booked > 0}
                title={
                  slot.booked > 0
                    ? "Cannot delete slot with existing bookings"
                    : "Delete slot"
                }
              >
                <FaTrashCan className={slot.booked > 0 ? "opacity-50" : ""} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {pending ? "Discard New Slot?" : `Delete Slot ${index + 1}?`}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {pending
                    ? `This will discard the unsaved slot (${formatSlotTime(slot.startTime)} - ${formatSlotTime(slot.endTime)}).`
                    : `This will permanently remove the slot (${formatSlotTime(slot.startTime)} - ${formatSlotTime(slot.endTime)}). This action cannot be undone.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className={buttonVariants({ variant: "destructive" })}
                >
                  {pending ? "Discard" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        <div className="space-y-1">
          <Label
            className="text-muted-foreground text-xs"
            htmlFor={`startTime-${slot.id}`}
          >
            Start Time
          </Label>
          <Input
            type="time"
            className="text-sm"
            value={formatTimeForInput(slot.startTime)}
            onChange={(e) => handleTimeChange("startTime", e.target.value)}
            id={`startTime-${slot.id}`}
            disabled={!slot.isActive}
          />
        </div>

        <div className="space-y-1">
          <Label
            className="text-muted-foreground text-xs"
            htmlFor={`endTime-${slot.id}`}
          >
            End Time
          </Label>
          <Input
            type="time"
            className="text-sm"
            value={formatTimeForInput(slot.endTime)}
            onChange={(e) => handleTimeChange("endTime", e.target.value)}
            id={`endTime-${slot.id}`}
            disabled={!slot.isActive}
          />
        </div>

        <div className="space-y-1">
          <Label
            className="text-muted-foreground text-xs"
            htmlFor={`duration-${slot.id}`}
          >
            Duration
          </Label>
          <Input
            readOnly
            value={calculateDuration(slot.startTime, slot.endTime)}
            className={`text-sm ${!slot.isActive ? "bg-muted text-muted-foreground" : "bg-muted/50"}`}
            id={`duration-${slot.id}`}
          />
        </div>

        <div className="space-y-1">
          <Label
            className="text-muted-foreground text-xs"
            htmlFor={`capacity-${slot.id}`}
          >
            Capacity
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
          <div className="text-muted-foreground text-xs">
            Booked: {slot.booked} / Max: {slot.maxCapacity}
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, errorIndex) => (
            <div
              key={errorIndex}
              className="flex items-center gap-1 text-xs text-red-500/80 dark:text-red-400/70"
            >
              <span>•</span>
              {error}
            </div>
          ))}
        </div>
      )}

      {hasChanges && !pending && (
        <div className="flex gap-2 border-t border-blue-200/40 pt-3 dark:border-blue-800/30">
          <Button
            onClick={() => {
              setIsSubmitting(true);
              try {
                onSaveChanges?.(slot, initialSlotRef.current);
                initialSlotRef.current = slot;
                setHasChanges(false);
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={errors.length > 0 || isSubmitting}
            className="flex flex-1 items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={() => handleReset()}
            variant="outline"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            Discard
          </Button>
        </div>
      )}

      {pending && (
        <div className="flex gap-2 border-t border-amber-200/40 pt-3 dark:border-amber-800/30">
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
            className="flex flex-1 items-center gap-2 bg-amber-500/85 text-white hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-600/70 dark:hover:bg-amber-500/70"
          >
            <Check className="h-4 w-4" />
            {isSubmitting ? "Adding..." : "Add Slot"}
          </Button>
        </div>
      )}
    </div>
  );
}
