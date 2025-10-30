import { Slot } from "@/types";

/**
 * Load slots from JSON data
 * Later, this can be replaced with an API call
 */
export async function loadSlots(dayId: string): Promise<Slot[]> {
  try {
    const response = await fetch(`http://localhost:3001/slots?dayId=${dayId}`);
    const data: Slot[] = await response.json(); // data is already an array
    return data;
  } catch (error) {
    console.error("[v0] Error loading slots:", error);
    return [];
  }
}

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
