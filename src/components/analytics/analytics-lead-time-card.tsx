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
import { AvgLeadTimeResult } from "@/types";
import { Clock, Info } from "lucide-react";

type Props = {
  data?: AvgLeadTimeResult;
  isLoading: boolean;
};

function formatLeadTime(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function AnalyticsLeadTimeCard({ data, isLoading }: Props) {
  return (
    <TooltipProvider delayDuration={200}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
            Avg Lead Time
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="text-muted-foreground/50 hover:text-muted-foreground size-3 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[240px] text-xs">
                Average time between when an appointment is booked and its
                scheduled date. Shorter lead times mean customers are booking
                closer to their visit.
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <div className="bg-primary/10 dark:bg-primary/20 flex size-7 items-center justify-center rounded-md">
            <Clock className="text-primary size-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <p className="text-primary text-2xl font-bold tabular-nums">
                {data ? formatLeadTime(data.avgLeadTimeMinutes) : "N/A"}
              </p>
              <CardDescription className="mt-1 text-xs">
                booking to appointment
              </CardDescription>
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
