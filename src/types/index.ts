export type BaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Entity<T> = BaseEntity & T;

export type Slot = Entity<{
  dayId: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  booked: number;
  maxCapacity: number;
}>;

export type MonthDay = Entity<{
  month: number;
  year: number;
  day: number;
  dayOfWeek: string;
  isWorkingDay: boolean;
}>;

export enum QueueStatus {
  PENDING = "pending",
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  DONE = "done",
}

export enum Category {
  REGULAR = "Regular",
  SENIOR = "Senior",
  PREGNANT = "Pregnant",
  PWD = "PWD",
}

export type Appointment = Entity<{
  appointmentCode: string;
  age: number;
  categoryCode: string;
  dateValidity: Date;
  queueStatus: QueueStatus;
  slotId: string;
}>;

export type Branch = Entity<{
  name: string;
  branchCode: string;
  address: string;
}>;
