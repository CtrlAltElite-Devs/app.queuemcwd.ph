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

export const pendingSlotTimeConfig = {
  defaultEnd: 60 * 60 * 1000,
  startTimeInterval: 60 * 60 * 1000,
  endTimeInterval: 2 * 60 * 60 * 1000,
};
