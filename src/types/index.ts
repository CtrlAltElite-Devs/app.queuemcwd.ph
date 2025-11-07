import { IconType } from "react-icons/lib";

export type BaseEntity = {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Entity<T> = BaseEntity & T;

export type Slot = Entity<{
  dayId: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  booked: number;
  maxCapacity: number;
  branchId: string;
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

export type Appointment = Entity<{
  appointmentCode: string;
  age: number;
  dateValidity: Date;
  queueStatus: QueueStatus;
  slotId: string;
  appointmentType: number;
}>;

export type Branch = Entity<{
  name: string;
  branchCode: string;
  address: string;
}>;

export type Navigation = {
  icon: IconType;
  url: string;
  name: string;
};
