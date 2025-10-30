export const CALENDAR_CONFIG = {
  className:
    "w-full max-w-xs rounded-lg border p-4 text-base shadow-md sm:max-w-sm md:max-w-md md:text-lg",
  numberOfMonths: 1,
  showOutsideDays: false,
} as const;

export type CalendarVariant = "single" | "range" | "multiple";

export const getCalendarProps = (variant: CalendarVariant = "single") => ({
  mode: variant,
  numberOfMonths: CALENDAR_CONFIG.numberOfMonths,
  showOutsideDays: CALENDAR_CONFIG.showOutsideDays,
  className: CALENDAR_CONFIG.className,
});
