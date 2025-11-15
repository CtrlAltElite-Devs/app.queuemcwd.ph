export const branches = ["Main Office", "SM Consolation Office"];

export enum Service {
  BILLING_CONCERNS = "Billing Concerns",
  WATER_SUPPLIER_ISSUES = "Water Supplier Issues",
  LEAK_REPORTS = "Leak Reports",
  SERVICE_CONNECTION_CONCERNS = "Service Connection Concerns",
}

export enum Category {
  REGULAR = "Regular",
  SENIOR = "Senior",
  PREGNANT = "Pregnant",
  PWD = "PWD",
}

export const TimeConfig = {
  ONE_HOUR: 60 * 60 * 1000,
  TWO_HOURS: 2 * 60 * 60 * 1000,

  // Business hours
  MIN_HOUR: 1,
  MAX_HOUR: 23,
  NEXT_DAY_START_HOUR: 1,

  // Slot configuration
  SLOT_DURATION: 60 * 60 * 1000,
  BUFFER_BETWEEN_SLOTS: 60 * 60 * 1000,
} as const;

export const pendingSlotTimeConfig = {
  defaultEnd: TimeConfig.SLOT_DURATION,
  startTimeInterval: TimeConfig.BUFFER_BETWEEN_SLOTS,
  endTimeInterval: TimeConfig.SLOT_DURATION,
};
