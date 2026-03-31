export type AnalyticsOverview = {
  total: number;
  totalToday: number;
  totalThisWeek: number;
  totalThisMonth: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
};

export type TimelineDataPoint = {
  date: string;
  count: number;
};

export type StatusBreakdownItem = {
  status: string;
  count: number;
};

export type AppointmentTypeItem = {
  appointmentType: number;
  count: number;
};

export type PeakHourItem = {
  hour: string;
  count: number;
};

export type StatusTrendItem = {
  date: string;
  status: string;
  count: number;
};

export type TopUserItem = {
  accountCode: string;
  count: number;
};

export type AvgLeadTimeResult = {
  avgLeadTimeMinutes: number;
};

export type MultiSeriesDataPoint = {
  date: string;
  completed: number;
  cancelled: number;
  noShow: number;
  pending: number;
};

export type StatusTrendWideRow = {
  date: string;
  done: number;
  cancelled: number;
  noShow: number;
  pending: number;
};
