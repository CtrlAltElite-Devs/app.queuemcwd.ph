"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnalyticsOverview } from "@/types";
import {
  CalendarCheck,
  CalendarDays,
  CalendarClock,
  Calendar,
  CheckCircle,
  XCircle,
  UserX,
  Info,
} from "lucide-react";

type Props = {
  data?: AnalyticsOverview;
  isLoading: boolean;
};

const countCards = [
  {
    key: "total" as const,
    label: "Total",
    icon: CalendarDays,
    hint: "Total appointments created within the selected date range, regardless of their current status.",
  },
  {
    key: "totalToday" as const,
    label: "Today",
    icon: Calendar,
    hint: "Appointments scheduled for today. Updates in real-time as new bookings come in.",
  },
  {
    key: "totalThisWeek" as const,
    label: "This Week",
    icon: CalendarClock,
    hint: "Appointments scheduled within the current calendar week (Monday-Sunday).",
  },
  {
    key: "totalThisMonth" as const,
    label: "This Month",
    icon: CalendarCheck,
    hint: "Appointments scheduled within the current calendar month.",
  },
];

const rateCards = [
  {
    key: "completionRate" as const,
    label: "Completion Rate",
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    hint: "Percentage of appointments that were marked as completed (done). Higher is better - aim for above 80%.",
  },
  {
    key: "cancellationRate" as const,
    label: "Cancellation Rate",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/40",
    hint: "Percentage of appointments that were cancelled before their scheduled time. A rising rate may indicate scheduling friction.",
  },
  {
    key: "noShowRate" as const,
    label: "No-Show Rate",
    icon: UserX,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    hint: "Percentage of appointments where the customer did not appear. High no-show rates suggest a need for reminders or shorter lead times.",
  },
];

export function AnalyticsOverviewCards({ data, isLoading }: Props) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {countCards.map(({ key, label, icon: Icon, hint }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                {label}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="text-muted-foreground/50 hover:text-muted-foreground size-3 cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-xs">
                    {hint}
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <Icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <p className="text-2xl font-bold tabular-nums">
                    {data?.[key]?.toLocaleString() ?? 0}
                  </p>
                  <CardDescription className="mt-1 text-xs">
                    appointments
                  </CardDescription>
                </>
              )}
            </CardContent>
          </Card>
        ))}
        {rateCards.map(({ key, label, icon: Icon, color, bg, hint }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                {label}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="text-muted-foreground/50 hover:text-muted-foreground size-3 cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] text-xs">
                    {hint}
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <div
                className={`flex size-7 items-center justify-center rounded-md ${bg}`}
              >
                <Icon className={`size-4 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <p className={`text-2xl font-bold tabular-nums ${color}`}>
                    {data?.[key]?.toFixed(1) ?? 0}%
                  </p>
                  <CardDescription className="mt-1 text-xs">
                    of total appointments
                  </CardDescription>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
