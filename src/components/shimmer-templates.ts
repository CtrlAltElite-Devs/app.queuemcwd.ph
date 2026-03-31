import { Service } from "@/constants";
import { Branch, MonthDay, ReportRecord, Slot } from "@/types";

export const shimmerBranchTemplates: Branch[] = [
  {
    id: "branch-template-main",
    name: "Main Office",
    branchCode: "MAIN",
    address: "Osmena Boulevard, Cebu City",
    allowedTimeFrame: 7,
  },
  {
    id: "branch-template-smcl",
    name: "SM Consolacion Hub",
    branchCode: "SMCL",
    address: "SM City Consolacion, Cebu",
    allowedTimeFrame: 7,
  },
];

const shimmerTemplateBranch = shimmerBranchTemplates[0];

export const shimmerSlotTemplateMonthDay: MonthDay = {
  id: "month-day-template",
  month: 3,
  year: 2026,
  day: 24,
  dayOfWeek: "Tuesday",
  isWorkingDay: true,
};

export const shimmerSlotTemplates: Slot[] = [
  {
    id: "slot-template-1",
    dayId: shimmerSlotTemplateMonthDay.id,
    startTime: "2026-03-24T08:00:00.000Z",
    endTime: "2026-03-24T08:30:00.000Z",
    isActive: true,
    booked: 1,
    maxCapacity: 6,
    branch: shimmerTemplateBranch,
    monthDay: shimmerSlotTemplateMonthDay,
  },
  {
    id: "slot-template-2",
    dayId: shimmerSlotTemplateMonthDay.id,
    startTime: "2026-03-24T09:00:00.000Z",
    endTime: "2026-03-24T09:30:00.000Z",
    isActive: true,
    booked: 2,
    maxCapacity: 6,
    branch: shimmerTemplateBranch,
    monthDay: shimmerSlotTemplateMonthDay,
  },
  {
    id: "slot-template-3",
    dayId: shimmerSlotTemplateMonthDay.id,
    startTime: "2026-03-24T10:00:00.000Z",
    endTime: "2026-03-24T10:30:00.000Z",
    isActive: true,
    booked: 0,
    maxCapacity: 6,
    branch: shimmerTemplateBranch,
    monthDay: shimmerSlotTemplateMonthDay,
  },
];

export const shimmerSummaryTemplateRows = [
  { requestType: Service.BILLING_CONCERNS, count: 18 },
  { requestType: Service.WATER_SUPPLIER_ISSUES, count: 12 },
  { requestType: Service.LEAK_REPORTS, count: 9 },
  { requestType: Service.SERVICE_CONNECTION_CONCERNS, count: 7 },
];

export const shimmerSummaryTemplateTotal = shimmerSummaryTemplateRows.reduce(
  (sum, row) => sum + row.count,
  0,
);

export const shimmerReportsTemplate: ReportRecord[] = [
  {
    id: "report-template-1",
    branchId: "template-branch",
    contactPerson: "Juan Dela Cruz",
    accountNumber: "0100-4455-21",
    referenceNumber: "REF-2026-1001",
    requestType: Service.BILLING_CONCERNS,
    cellphoneNumber: "09171234567",
    scheduledAt: "2026-03-24T08:00:00.000Z",
  },
  {
    id: "report-template-2",
    branchId: "template-branch",
    contactPerson: "Maria Santos",
    accountNumber: "0100-7781-04",
    referenceNumber: "REF-2026-1002",
    requestType: Service.LEAK_REPORTS,
    cellphoneNumber: "09181234567",
    scheduledAt: "2026-03-24T10:00:00.000Z",
  },
  {
    id: "report-template-3",
    branchId: "template-branch",
    contactPerson: "Paolo Reyes",
    accountNumber: "0100-5509-62",
    referenceNumber: "REF-2026-1003",
    requestType: Service.WATER_SUPPLIER_ISSUES,
    cellphoneNumber: "09191234567",
    scheduledAt: "2026-03-24T13:00:00.000Z",
  },
];
