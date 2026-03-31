import { IconType } from "react-icons/lib";

export type {
  AnalyticsOverview,
  TimelineDataPoint,
  StatusBreakdownItem,
  AppointmentTypeItem,
  PeakHourItem,
  StatusTrendItem,
  TopUserItem,
  AvgLeadTimeResult,
  MultiSeriesDataPoint,
  StatusTrendWideRow,
} from "./analytics";

export type BaseEntity = {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Entity<T> = BaseEntity & T;

export type Slot = Entity<{
  dayId: string;
  startTime: Date | string;
  endTime: Date | string;
  isActive: boolean;
  booked: number;
  maxCapacity: number;
  branch: Branch;
  monthDay: MonthDay;
}>;

export type MonthDay = Entity<{
  month: number;
  year: number;
  day: number;
  dayOfWeek: string;
  isWorkingDay: boolean;
  additionalNotes?: string;
}>;

export enum QueueStatus {
  PENDING = "pending",
  ACTIVE = "active",
  ARRIVED = "arrived",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  DONE = "done",
  NO_SHOW = "noShow",
}

export type Appointment = Entity<{
  appointmentCode: string;
  age: number;
  dateValidity: Date;
  queueStatus: QueueStatus;
  slotId: string;
  appointmentType: number;
}>;

export type ReportRecord = {
  id: string;
  branchId: string;
  contactPerson: string;
  accountNumber: string;
  referenceNumber: string;
  requestType: string;
  cellphoneNumber: string;
  scheduledAt: string;
};

export type AppointmentResponse = {
  id: string;
  appointmentCode: string;
  accountCode: string;
  contactPerson: string;
  contact: string;
  appointmentType: number;
  queueStatus: QueueStatus;
  dateValidity: string;
  slot: {
    id: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    maxCapacity: number;
    booked: number;
  };
  branch: { id: string };
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type Branch = Entity<{
  name: string;
  branchCode: string;
  address: string;
  allowedTimeFrame: number;
}>;

export type Navigation = {
  icon: IconType;
  url: string;
  name: string;
};

export type Account = {
  email: string;
  password: string;
};

export type Admin = Account & {
  role: string;
  branchId: string;
};

export type GetSlotsResponse = {
  slots: Slot[];
  additionalNotes: string;
};
