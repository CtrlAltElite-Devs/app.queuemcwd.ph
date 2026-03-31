import {
  AnalyticsOverview,
  AvgLeadTimeResult,
  MultiSeriesDataPoint,
  StatusBreakdownItem,
  StatusTrendWideRow,
  TimelineDataPoint,
  TopUserItem,
} from "@/types";
import { AppointmentTypeBreakdownRow } from "@/services/analytics/get-analytics-appointment-type-breakdown";
import { FormattedPeakHourItem } from "@/services/analytics/get-analytics-peak-hours";

export const analyticsOverviewTemplate: AnalyticsOverview = {
  total: 184,
  totalToday: 18,
  totalThisWeek: 72,
  totalThisMonth: 184,
  completed: 136,
  cancelled: 24,
  noShow: 12,
  completionRate: 73.9,
  cancellationRate: 13,
  noShowRate: 6.5,
};

export const analyticsLeadTimeTemplate: AvgLeadTimeResult = {
  avgLeadTimeMinutes: 145,
};

export const analyticsTimelineTemplate: TimelineDataPoint[] = [
  { date: "2026-03-20", count: 18 },
  { date: "2026-03-21", count: 22 },
  { date: "2026-03-22", count: 16 },
  { date: "2026-03-23", count: 28 },
  { date: "2026-03-24", count: 24 },
];

export const analyticsStatusBreakdownTemplate: StatusBreakdownItem[] = [
  { status: "done", count: 136 },
  { status: "cancelled", count: 24 },
  { status: "noShow", count: 12 },
  { status: "pending", count: 9 },
  { status: "active", count: 3 },
];

export const analyticsAppointmentTypeTemplate: AppointmentTypeBreakdownRow[] = [
  { appointmentType: "Billing Concerns", count: 54 },
  { appointmentType: "Water Supplier Issues", count: 41 },
  { appointmentType: "Leak Reports", count: 33 },
  { appointmentType: "Service Connection Concerns", count: 27 },
];

export const analyticsPeakHoursTemplate: FormattedPeakHourItem[] = [
  { hour: "8", label: "8 AM", count: 14 },
  { hour: "9", label: "9 AM", count: 18 },
  { hour: "10", label: "10 AM", count: 22 },
  { hour: "11", label: "11 AM", count: 16 },
  { hour: "13", label: "1 PM", count: 12 },
];

export const analyticsStatusTrendTemplate: StatusTrendWideRow[] = [
  { date: "2026-03-20", done: 10, cancelled: 2, noShow: 1, pending: 3 },
  { date: "2026-03-21", done: 14, cancelled: 1, noShow: 2, pending: 4 },
  { date: "2026-03-22", done: 12, cancelled: 2, noShow: 1, pending: 3 },
  { date: "2026-03-23", done: 18, cancelled: 3, noShow: 1, pending: 4 },
  { date: "2026-03-24", done: 16, cancelled: 2, noShow: 1, pending: 5 },
];

export const analyticsTopUsersTemplate: TopUserItem[] = [
  { accountCode: "0100-4455-21", count: 12 },
  { accountCode: "0100-1023-88", count: 10 },
  { accountCode: "0100-7781-04", count: 8 },
  { accountCode: "0100-5509-62", count: 7 },
];

export const analyticsMultiSeriesTemplate: MultiSeriesDataPoint[] = [
  { date: "2026-03-20", completed: 10, cancelled: 2, noShow: 1, pending: 3 },
  { date: "2026-03-21", completed: 13, cancelled: 1, noShow: 2, pending: 4 },
  { date: "2026-03-22", completed: 11, cancelled: 2, noShow: 1, pending: 3 },
  { date: "2026-03-23", completed: 17, cancelled: 3, noShow: 1, pending: 4 },
  { date: "2026-03-24", completed: 15, cancelled: 2, noShow: 1, pending: 5 },
];
