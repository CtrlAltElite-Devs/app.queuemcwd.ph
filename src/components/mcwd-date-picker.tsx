"use client";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MonthDay } from "@/types";
import { formatDate, isValidDate } from "@/utils";
import { useCallback, useState } from "react";
import AppointmentCalendar from "./appointment-calendar";

interface McwdDatePickerProps {
  onDateSelect?: (
    date: Date | undefined,
    monthDay: MonthDay | undefined,
  ) => void;
}

export function McwdDatePicker({ onDateSelect }: McwdDatePickerProps) {
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [value, setValue] = useState(formatDate(date));

  const handleDateSelect = useCallback(
    (date: Date | undefined, monthDay: MonthDay | undefined) => {
      setDate(date);
      setValue(formatDate(date));
      onDateSelect?.(date, monthDay);
    },
    [onDateSelect],
  );

  return (
    <div className="flex w-[300px] flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Filter by Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={(e) => {
            const date = new Date(e.target.value);
            setValue(e.target.value);
            if (isValidDate(date)) {
              setDate(date);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <AppointmentCalendar onDateSelect={handleDateSelect} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
