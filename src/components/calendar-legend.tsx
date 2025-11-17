"use client";

import { cn } from "@/lib/utils";

export function CalendarLegend() {
  const legend = [
    {
      label: "Today",
      className: "border-2 border-blue-500 dark:border-blue-400 rounded-lg",
    },
    {
      label: "Selected",
      className: "bg-primary text-white rounded-lg dark:bg-blue-400",
    },
    {
      label: "Working Day",
      className: "bg-working-day rounded-lg dark:text-black",
    },
    {
      label: "Non-working Day",
      className: "bg-non-working-day text-red-700 dark:text-red-400 rounded-lg",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
      <div className="space-y-2 p-3">
        <div className="space-y-2">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn("h-4 w-4", item.className)} />
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
