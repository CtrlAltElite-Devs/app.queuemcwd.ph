import { TimeConfig } from "@/constants";
import { formatTimeToHHmm } from ".";
import { isTimeFormat, timeToMinutes } from "./slot-utils";

export const SlotHelpers = {
  createSlotAfter(lastSlotEnd: Date | null): {
    startTime: Date;
    endTime: Date;
  } {
    const now = new Date();

    if (!lastSlotEnd) {
      // First slot of the day
      const startTime = now;
      const endTime = new Date(now.getTime() + TimeConfig.SLOT_DURATION);

      if (
        TimeHelpers.isElevenPmOrLater(startTime) ||
        TimeHelpers.isElevenPmOrLater(endTime)
      ) {
        return this.createNextDaySlot();
      }

      return { startTime, endTime };
    }

    if (TimeHelpers.isElevenPmOrLater(lastSlotEnd)) {
      return this.createNextDaySlot();
    }

    // Normal case
    let startTime = new Date(
      lastSlotEnd.getTime() + TimeConfig.BUFFER_BETWEEN_SLOTS,
    );
    let endTime = new Date(startTime.getTime() + TimeConfig.SLOT_DURATION);

    // Handle edge case where slot would end after 11 PM
    if (TimeHelpers.isElevenPmOrLater(endTime)) {
      endTime = TimeHelpers.createTime(lastSlotEnd, TimeConfig.MAX_HOUR, 0);
      startTime = new Date(endTime.getTime() - TimeConfig.SLOT_DURATION);
    }

    return { startTime, endTime };
  },

  createNextDaySlot(): { startTime: Date; endTime: Date } {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(TimeConfig.NEXT_DAY_START_HOUR, 0, 0, 0);

    const startTime = tomorrow;
    const endTime = new Date(tomorrow.getTime() + TimeConfig.SLOT_DURATION);

    return { startTime, endTime };
  },
};

export const TimeHelpers = {
  isElevenPmOrLater(date: Date): boolean {
    return date.getHours() >= TimeConfig.MAX_HOUR;
  },

  createNextDayTime(baseDate: Date, hours: number, minutes: number): Date {
    const nextDay = new Date(baseDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(hours, minutes, 0, 0);
    return nextDay;
  },

  createTime(baseDate: Date, hours: number, minutes: number): Date {
    const time = new Date(baseDate);
    time.setHours(hours, minutes, 0, 0);
    return time;
  },
};
