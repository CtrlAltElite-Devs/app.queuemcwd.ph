"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusTrendWideRow } from "@/types";
import { format, parseISO } from "date-fns";
import { Activity } from "lucide-react";

type Props = {
  data?: StatusTrendWideRow[];
  isLoading: boolean;
};

const chartConfig = {
  done: {
    label: "Completed",
    color: "var(--chart-1)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-4)",
  },
  noShow: {
    label: "No Show",
    color: "var(--chart-3)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function AnalyticsStatusTrendChart({ data = [], isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="text-primary size-4" />
          Status Trend (Stacked)
        </CardTitle>
        <CardDescription>
          Stacked area view of appointment statuses over time. The total height
          represents all appointments for each day; each colored band shows the
          proportion of a specific status. A growing total height means
          increasing appointment volume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : data.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No trend data available.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <AreaChart accessibilityLayer data={data}>
                <defs>
                  <linearGradient
                    id="fillTrendDone"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-done)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-done)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="fillTrendCancelled"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-cancelled)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-cancelled)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="fillTrendNoShow"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-noShow)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-noShow)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="fillTrendPending"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-pending)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-pending)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => format(parseISO(value), "MMM d")}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        format(parseISO(value), "MMM d, yyyy")
                      }
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  dataKey="pending"
                  fill="url(#fillTrendPending)"
                  fillOpacity={0.4}
                  stroke="var(--color-pending)"
                  stackId="a"
                  strokeWidth={0.8}
                  strokeDasharray="3 3"
                />
                <Area
                  dataKey="noShow"
                  fill="url(#fillTrendNoShow)"
                  fillOpacity={0.4}
                  stroke="var(--color-noShow)"
                  stackId="a"
                  strokeWidth={0.8}
                  strokeDasharray="3 3"
                />
                <Area
                  dataKey="cancelled"
                  fill="url(#fillTrendCancelled)"
                  fillOpacity={0.4}
                  stroke="var(--color-cancelled)"
                  stackId="a"
                  strokeWidth={0.8}
                  strokeDasharray="3 3"
                />
                <Area
                  dataKey="done"
                  fill="url(#fillTrendDone)"
                  fillOpacity={0.4}
                  stroke="var(--color-done)"
                  stackId="a"
                  strokeWidth={0.8}
                  strokeDasharray="3 3"
                />
              </AreaChart>
            </ChartContainer>
            <p className="text-muted-foreground mt-3 text-xs">
              Areas are stacked: the top edge of the chart represents total
              daily appointments. Compare the relative thickness of each band to
              see how status proportions shift over time.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
