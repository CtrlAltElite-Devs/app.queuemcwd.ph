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
