import { Slot } from "@/types";
import { formatTimeToHHmm } from ".";

/**
 * Get available slots count for a specific day
 */
export function getAvailableSlotsCount(slots: Slot[]): number {
  return slots.filter((slot) => slot.booked < slot.maxCapacity).length;
}

/**
 * Get slot by ID
 */
export function getSlotById(slots: Slot[], slotId: string): Slot | undefined {
  return slots.find((slot) => slot.id === slotId);
}

/**
 * Check if a slot is available
 */
export function isSlotAvailable(slot: Slot): boolean {
  return slot.isActive && slot.booked < slot.maxCapacity;
}

export function formatSlotTime(time: Date) {
  const dateObj = typeof time === "string" ? new Date(time) : time;

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return dateObj.toLocaleTimeString(undefined, options);
}

/**
 * Convert ISO date string to 24-hour format for time inputs
 * Example: "2025-11-12T01:00:00.000Z" → "01:00"
 * Example: "2025-11-12T14:30:00.000Z" → "14:30"
 */
export function formatTimeForInput(time: Date | string): string {
  if (!time) return "";

  const dateObj = typeof time === "string" ? new Date(time) : time;

  if (isNaN(dateObj.getTime())) {
    console.warn("Invalid date:", time);
    return "";
  }

  // Use local time (not UTC) since time inputs use local time
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * For display - shows 12-hour format with AM/PM
 * Example: "2025-11-12T01:00:00.000Z" → "1:00 AM"
 * Example: "2025-11-12T14:30:00.000Z" → "2:30 PM"
 */
export function formatTimeForDisplay(time: Date | string): string {
  const dateObj = typeof time === "string" ? new Date(time) : time;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Time";
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return dateObj.toLocaleTimeString("en-US", options);
}

/**
 * For DURATION CALCULATION - calculates time difference
 */
export const calculateDuration = (
  startTime: Date | string,
  endTime: Date | string,
): string => {
  const startTimeStr = isTimeFormat(startTime)
    ? startTime
    : formatTimeToHHmm(startTime);

  const endTimeStr = isTimeFormat(endTime)
    ? endTime
    : formatTimeToHHmm(endTime);

  const startMinutes = timeToMinutes(startTimeStr as string);
  const endMinutes = timeToMinutes(endTimeStr as string);
  const totalMinutes = endMinutes - startMinutes;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
  }
  return `${minutes}m`;
};

export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export const isTimeFormat = (time: unknown): boolean => {
  return (
    typeof time === "string" && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
  );
};
